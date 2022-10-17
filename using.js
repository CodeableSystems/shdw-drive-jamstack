import through from 'through2';    
export default function() {
  return through.obj(function(file, encoding, callback) {
    callback(null, file);
  });
};
