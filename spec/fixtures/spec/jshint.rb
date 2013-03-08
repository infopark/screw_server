jshint(:code) do |suite|
  suite.file_list = ["#{File.dirname(__FILE__)}/../code/example.js"]
  suite.options = {
    :predef => ["window"]
  }
end

jshint(:spec) do |suite|
  suite.file_list = ["#{File.dirname(__FILE__)}/example_spec.js"]
end
