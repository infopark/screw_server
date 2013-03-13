(function() {

Screw.jshint_scripts = {};

Screw.matching_suite = function(filename) {
  var suite;
  $.each(Screw.jshint_suites, function() {
    var found;
    $.each(this.file_list, function() {
      if (this == filename) { found = true; }
    });
    if (found) { suite = this; }
  });
  return suite;
};

$("script").map(function() {
  var source_url = $(this).attr("src");
  if (source_url && source_url !== "") {
    var normalized_source_url = source_url.split("?")[0];

    if (!Screw.matching_suite(normalized_source_url)) { return; }

    Screw.jshint_scripts[normalized_source_url] = null;

    Screw.ajax({
      url: source_url,
      dataType: "text",
      contentType: "text/plain",
      success: function(code) {
        Screw.jshint_scripts[normalized_source_url] = code;
      }
    });
  }
});

if (Screw.jshint_suites.length > 0) {
  Screw.Unit(function(){
    describe("JSHint check", function() {
      it("should succeed", function() {
        var message = "";
        var ajax = Screw.ajax;
        $.each(Screw.jshint_scripts, function(name, source_code) {
          if (source_code === null) { throw "failed to load "+name; }

          var suite = Screw.matching_suite(name);

          if (!JSHINT(source_code, suite.options)) {
            for (var i = 0; i < JSHINT.errors.length; i += 1) {
              var e = JSHINT.errors[i];
              if (e) {
                var line = parseInt(e.line, 10);
                var character = parseInt(e.character, 10);
                message += 'JSHint at ' + name + ":" + line + ' character ' +
                  character + ': ' + e.reason + "\n";
                message += (e.evidence || '').
                  replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1") + "\n";
                message += "\n";
              }
            }
          }
        });
        if (message.length > 0) { throw message; }
      });
    });
  });
}

}());