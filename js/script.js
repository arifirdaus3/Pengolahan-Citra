function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $("#hidden-img").attr("src", e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
    addCanvas();
  }
}
function addCanvas() {
  var canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
    img = document.querySelector("#hidden-img");

  canvas.width = img.width;
  canvas.height = img.height;

  context.drawImage(img, 0, 0);
}
function filterGrayscale() {
  var canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
    pixel = context.getImageData(0, 0, canvas.width, canvas.height);

  for (i = 0; i < pixel.data.length; i += 4) {
    gray = (pixel.data[i] + pixel.data[i + 1] + pixel.data[i + 2]) / 3;
    pixel.data[i] = gray;
    pixel.data[i + 1] = gray;
    pixel.data[i + 2] = gray;
  }

  context.putImageData(pixel, 0, 0);
}
function kernelFilter(kernel) {
  var canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
    imageData = context.getImageData(0, 0, canvas.width, canvas.height),
    pixel = [],
    anu = 0;
  for (var i = 0; i < canvas.height; i++) {
    var temp_pixel = [];
    for (var j = 0; j < canvas.width; j++) {
      var object = {
        R: imageData.data[anu * 4],
        G: imageData.data[anu * 4 + 1],
        B: imageData.data[anu * 4 + 2],
        A: imageData.data[anu * 4 + 3]
      };
      temp_pixel.push(object);
      anu++;
    }
    pixel.push(temp_pixel);
  }

  var red = [];
  var green = [];
  var blue = [];
  var half_kernel = Math.floor(kernel[0].length / 2);
  for (var i = 0; i < canvas.height; i++) {
    for (var j = 0; j < canvas.width; j++) {
      var r = 0;
      var g = 0;
      var b = 0;
      var a = 0;
      var xx = -1 * half_kernel;

      for (var x = 0; x < kernel.length; x++) {
        var yy = -1 * half_kernel;
        for (var y = 0; y < kernel[x].length; y++) {
          if (
            i + x >= half_kernel &&
            j + y >= half_kernel &&
            i + x < canvas.height + half_kernel &&
            j + y < canvas.width + half_kernel
          ) {
            r += kernel[x][y] * pixel[i + xx][j + yy].R;
            g += kernel[x][y] * pixel[i + xx][j + yy].G;
            b += kernel[x][y] * pixel[i + xx][j + yy].B;
          }

          yy++;
        }
        xx++;
      }

      red.push(r);
      green.push(g);
      blue.push(b);
    }
  }

  var count = 0;
  for (var i = 0; i < canvas.height; i++) {
    for (var j = 0; j < canvas.width; j++) {
      pixel[i][j].R = red[count];
      pixel[i][j].G = green[count];
      pixel[i][j].B = blue[count];

      count++;
    }
  }

  var tambah = 0;
  for (var i = 0; i < canvas.height; i++) {
    for (var j = 0; j < canvas.width; j++) {
      imageData.data[tambah * 4] = pixel[i][j].R;
      imageData.data[tambah * 4 + 1] = pixel[i][j].G;
      imageData.data[tambah * 4 + 2] = pixel[i][j].B;
      imageData.data[tambah * 4 + 3] = pixel[i][j].A;

      tambah++;
    }
  }

  context.putImageData(imageData, 0, 0);
}

$("#upload").change(function() {
  readURL(this);
});
$("#edgeDetection").click(function() {
  var kernel = [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]];
  kernelFilter(kernel);
});
$("#sharpen").click(function() {
  var kernel = [[0, -1, 0], [-1, 5, -1], [0, -1, 0]];
  kernelFilter(kernel);
});
$("#boxBlur").click(function() {
  var kernel = [
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9]
  ];
  kernelFilter(kernel);
});
$("#gausianBlur").click(function() {
  var kernel = [
    [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
    [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
    [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
    [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
    [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256]
  ];
  kernelFilter(kernel);
});
$("#embos").click(function() {
  var kernel = [[-2,-1,0], [-1,1,1], [0,1,2]];
  kernelFilter(kernel);
});

$("#customFilter").click(function() {
  var custom1 = parseInt($("#custom1").val());
  var custom2 = parseInt($("#custom2").val());
  var custom3 = parseInt($("#custom3").val());
  var custom4 = parseInt($("#custom4").val());
  var custom5 = parseInt($("#custom5").val());
  var custom6 = parseInt($("#custom6").val());
  var custom7 = parseInt($("#custom7").val());
  var custom8 = parseInt($("#custom8").val());
  var custom9 = parseInt($("#custom9").val());

  var kernel = [
    [custom1, custom2, custom3],
    [custom4, custom5, custom6],
    [custom7, custom8, custom9]
  ];

  kernelFilter(kernel);
});
