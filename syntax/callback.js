// function a() {
//   console.log('A');
// }

const a = function () {
  console.log('A');
};

function slowFunc(callback) {
  callback();
}

slowFunc(a);
