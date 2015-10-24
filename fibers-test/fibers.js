var Fiber = require('fibers');

function doAsyncWork () {
  var fiber = Fiber.current;
  setTimeout(function () {
    fiber.run('result of work');
  }, 3000);
  return Fiber.yield()
}

Fiber(function () {
  console.log( doAsyncWork() )
}).run();

