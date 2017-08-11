var fs = require('fs');
const code = String("(ns cover.aggregate.jacoco-test\n  (:require [clojure.test           :refer :all]\n            [cover.aggregate.jacoco :refer :all]))\n\n(def jacoco-dir \"test/cover/testfiles/jacoco/\")\n(defn _test-path [f] (str jacoco-dir f))\n(def _minimal (_test-path \"minimal.xml\"))\n(def _complex (_test-path \"some_packages_classes_and_methods.xml\"))\n(def _class-example (_test-path \"class_coverage.xml\"))\n(def _invalid-no-line-count (_test-path \"invalid_no_line_count.xml\"))\n(def _invalid-no-counter (_test-path \"invalid_non_counter_elem_in_method.xml\"))\n(def _cloverage-file (_test-path \"cloverage_file.xml\"))\n\n\n;;parse-legacy-line-counter\n(deftest should-aggregate-illegal-as-neutral\n  (is (= (#'cover.aggregate.jacoco/parse-legacy-line-counter \"no-coverage-data\") [0 0])))\n\n(deftest should-aggregate-valid-legacy\n  (is (= (#'cover.aggregate.jacoco/parse-legacy-line-counter \"96% (186/193)\") [186 193])))\n;; aggregate files\n\n(deftest should-aggregate-empty-map-if-package-not-found\n  (is (= (aggregate (list \"does/not/exist\") _minimal) {\"does/not/exist\" {}})))\n\n(deftest should-aggregate-single-method-coverage-if-package-matches-exactly\n  (is (= (aggregate (list \"com/freiheit/my/package\") _minimal) {\"com/freiheit/my/package\" {:covered 50 :lines 100 :percentage 0.5}})))\n\n(deftest should-aggregate-to-zero-if-no-line-count-found\n  (is (= (aggregate (list \"com/freiheit/my/package\") _complex) {\"com/freiheit/my/package\" {:covered 657 :lines 1142 :percentage 0.5753064798598949}})))\n\n(deftest should-aggregate-single-method-coverage-if-package-matches-exactly\n  (is (= (aggregate (list \"com/freiheit/my/package\") _invalid-no-line-count) {\"com/freiheit/my/package\" {:covered 0 :lines 0 :percentage 1}})))\n\n(deftest should-aggregate-even-if-invalid-non-counter-in-method-data\n  (is (= (aggregate (list \"com/freiheit/my/package\") _invalid-no-counter) {\"com/freiheit/my/package\" {:covered 50 :lines 100 :percentage 0.5}})))\n\n; test file from lein cloverage --emma-xml\n(deftest should-aggregate-cloverage-file\n    (is (= (aggregate (list \"/\") _cloverage-file) {\"/\" {:covered 186 :lines 193 :percentage 0.9637305699481865}})))\n\n;;; aggregate-class-coverage\n\n(deftest should-aggregate-class-coverage\n  (is (= (aggregate-class-coverage _class-example)\n         {\"com/freiheit/MyClass1\" {:covered 0 :lines 10 :percentage 0.0},\n          \"com/freiheit/foo/Bar\" {:covered 10 :lines 100 :percentage 0.1},\n          \"com/Bar2\" {:covered 200 :lines 200 :percentage 1.0}})))\n\n;;; special / handling\n\n(deftest should-aggregate-all-in-minimal\n  (is (= (aggregate (list \"/\") _minimal) {\"/\" {:covered 50 :lines 100 :percentage 0.5}})))\n\n(deftest should-aggregate-all-in-more-complex-test-file\n  (is (= (aggregate (list \"/\") _complex) {\"/\" {:covered 657 :lines 1142 :percentage 0.5753064798598949}})))\n\n(deftest should-aggregate-all-in-class-example\n  (is (= (aggregate (list \"/\") _class-example) {\"/\" {:covered 210 :lines 310 :percentage 0.6774193548387097}})))\n\n(deftest should-allow-combine-of-all-aggregate-with-others\n  (is (= (aggregate (list \"/\" \"com/freiheit/my/package\") _complex) {\"/\" {:covered 657 :lines 1142 :percentage 0.5753064798598949}\n                                                                    \"com/freiheit/my/package\" {:covered 657 :lines 1142 :percentage 0.5753064798598949}})))\n\n\n;; stats\n\n(deftest should-aggregate-root\n  (is (= {:covered 657 :lines 1142 :percentage 0.5753064798598949}\n         (stats _complex))))\n");

console.log(code);


var maximum_indent;
var maximum_reached = false;

for (var i = 0; i < 710; i++) {
  var matches = code.match(new RegExp(" {" + String(i) + "}", "g"));
  if (matches == undefined || matches == null) {
    break;
  } else {
    maximum_indent = i;
  }
}

console.log("Max-Indent: " + maximum_indent);
return maximum_indent;
