/**
 *
 * @hack 检测部分mp4视频的编码格式、用于检测chrome浏览器不能播放的问题
 *
 * 参考链接：
 *  1、<http://www.soolco.com/post/83098_1_1.html>
 *  2、<https://gpac.github.io/mp4box.js/>
 *
 * */

export const checkVideoCode = (file, callback) => {
  const mp4boxFile = MP4Box.createFile();

  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = function (e) {
    const arrayBuffer = e.target.result;
    arrayBuffer.fileStart = 0;
    mp4boxFile.appendBuffer(arrayBuffer);
  };

  mp4boxFile.onReady = function (info) {
    callback(info);
  };
};
