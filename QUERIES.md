**ALL QUERIES OVERVIEW**
--------------------
*Note that there are 2 Query Syntaxes for BigQuery. Standard SQL and Legacy SQL. If you are developing new Queries, standard SQL Syntax is preferred. You can change the Syntax Mode of Queries under >Show Options< and then untick Legacy SQL*
<br>

**Find How many Times "This Should Never Happen" was in your code**

  
      #LEGACY SQL SYNTAX
      SELECT count(*)
    FROM (SELECT id, repo_name, path
            FROM [your-files]
          ) AS F
    JOIN (SELECT id
            FROM [your-contents]
           WHERE content CONTAINS 'This should never happen') AS C
    ON F.id = C.id;


**Most Commonly Used Go Packages**

    #LEGACY SQL SYNTAX
    SELECT
      REGEXP_EXTRACT(line, r'"([^"]+)"') AS url,
      COUNT(*) AS count
    FROM FLATTEN(
      (SELECT
      SPLIT(SPLIT(REGEXP_EXTRACT(content, r'.*import\s*[(]([^)]*)[)]'), '\n'), ';') AS line,
      FROM
        (SELECT id, content FROM [your-contents]
         WHERE REGEXP_MATCH(content, r'.*import\s*[(][^)]*[)]')) AS C
        JOIN EACH
        (SELECT id FROM [your-files]
         WHERE path LIKE '%.go' GROUP BY id) AS F
        ON C.id = F.id), line)
    GROUP BY url
    HAVING url IS NOT NULL
    ORDER BY count DESC

**Most Commonly Used Java Packages**

    #LEGACY SQL SYNTAX
    SELECT package, COUNT(*) c
    FROM (
      SELECT REGEXP_EXTRACT(line, r' ([a-z0-9\._]*)\.') package, id
      FROM (
         SELECT SPLIT(content, '\n') line, id
         FROM [your-contents]
         WHERE content CONTAINS 'import'
         AND path LIKE '%.java'
         HAVING LEFT(line, 6)='import'
      )
      GROUP BY package, id
    )
    GROUP BY 1
    ORDER BY c DESC
    LIMIT 500;

**Counting .go Files (Adjust for any other extension)**

    #LEGACY SQL SYNTAX
    SELECT COUNT(*)
    FROM [your-files]
    WHERE RIGHT(path, 3) = '.go'

These Queries are copied from [This Medium Post from Francesc Campoy](https://medium.com/google-cloud/analyzing-go-code-with-bigquery-485c70c3b451) and from [This Gist by arfon](https://gist.github.com/arfon/49ca314a5b0a00b1ebf91167db3ff02c). Check these links out for more information. Also check out [This Post by Felipe Hoffa](https://medium.com/google-cloud/github-on-bigquery-analyze-all-the-code-b3576fd2b150) for more info.


----------

**MORE QUERIES**
------------

**Get the most frequently changed files in a repository** <br>
The results show the most frequent files which are found in all commits and shows the average number of affected lines per commit.

    #SQL SYNTAX
    SELECT
      d.new_path,
      repo_name,
      COUNT(*) AS commits,
      ROUND(AVG(d.changed_lines + d.added_lines + d.deleted_lines)) AS affected_lines
    FROM
      `your-commits`,
      UNNEST(difference) AS d
    WHERE
      repo_name="sql-api"
    GROUP BY
      d.new_path,
      repo_name
    ORDER BY
      commits DESC
      LIMIT 100;


**Rank committers by number of commits to a project** <br>
*Chance DESC to ASC to get the least active committers*

    #SQL Syntax
    SELECT
      committer.name,
      COUNT(*) AS commits
    FROM
      `fdc-test-statistic.git.commits`,
      UNNEST(difference) AS d
    WHERE
      repo_name="sql-api"
    GROUP BY
      committer.name
    ORDER BY
      commits DESC
    LIMIT
      100;

**TOP 10 Committers by total number of added lines to project** <br>
    
    #SQL Syntax
    SELECT
      committer.name,
      SUM(d.added_lines) AS added_lines
    FROM
      `fdc-test-statistic.git.commits`,
      UNNEST(difference) AS d
    GROUP BY
      committer.name
    ORDER BY
      added_lines DESC
    LIMIT 10;

**Get most Complex Code by maximum indent depth** <br>
*This Query utilizes User Defined Functions in Javascript. Deeply nested code with high indents is likely to be rather complex code.*

      #SQL SYNTAX
      CREATE TEMPORARY FUNCTION
      getComplexity(code STRING)
      RETURNS INT64
      LANGUAGE js AS """
        var maximum_indent = 0;

        for (var i = 0; i < 500; i++) {
          var matches = code.match(new RegExp(" {" + String(i) + "}", "g"));
          if (matches == undefined || matches == null) {
            break;
          } else {
            maximum_indent = i;
          }
        }
        return maximum_indent;
    """;
    SELECT
      path,
      repo_name,
      getComplexity(content) AS complexity,
      content
    FROM
      `fdc-test-statistic.git.contents`
    ORDER BY
      complexity DESC
    LIMIT
      100;

**Reloaded: Get most Complex Code by maximum indent depth** <br>
*Alternative complexity function hack.*

CREATE TEMPORARY FUNCTION getComplexity(lines ARRAY<STRING>, tab_indent INT64, space_indent INT64) RETURNS INT64
LANGUAGE js AS """  
    var tabs = 0;
    var spaces = 0;
    for (var i=0; i < lines.length; i++) {
      var line = "" + lines[i];
      if (line.trim().length === 0) {
        continue;
      }
      
      for (var j=0; j < line.length; j++) {
        var c = line.charAt(j);
        if (c !== ' ' && c !== '\t') {
          break;
        }
        if (c === ' ') {
          spaces++;
          continue;
        }
        if (c === '\t') {
          tabs++;
        }
      }
      
    }
    return (tabs/tab_indent) + (spaces/space_indent);
""";
SELECT
  path,
  repo_name,
  getComplexity(SPLIT(content, "\n"), 4, 4) AS complexity,
  content
FROM
  `fdc-test-statistic.git.contents`
ORDER BY
  complexity DESC
LIMIT
  100;
