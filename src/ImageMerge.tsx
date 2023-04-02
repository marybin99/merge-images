import React, { useEffect, useState } from "react";
import mergeImages from "merge-images";
import axios from "axios";

function dataURLtoFile(dataurl: string, filename: string) {
  var arr: any = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const colorUrl =
  "https://onthemars-dev.s3.ap-northeast-2.amazonaws.com/images/background-color/06.png";
const cropUrl =
  "https://onthemars-dev.s3.ap-northeast-2.amazonaws.com/images/vegi/01.png";
const color = colorUrl.split("/"); // color[color.length-1] : 06.png
const crop = cropUrl.split("/");

function change(url, setImg) {
  //   const token = sessionStorage.getItem("accessToken");
  //   let xhr = new XMLHttpRequest();
  //   //   xhr.open("GET", url, true);
  //   if (typeof token === "string") xhr.setRequestHeader("Authorization", token);
  //   xhr.responseType = "blob"; // 핵심
  //   //   xhr.send();
  //   xhr.onreadystatechange = function () {
  //     if (this.readyState === 4 && this.status === 200) {
  //       let url = window.URL || window.webkitURL;
  //       let imgsrc = url.createObjectURL(this.response);
  //       setImg(imgsrc);
  //     }
  //   };
  axios({
    method: "GET",
    url,
    responseType: "blob",
  }).then((res) => {
    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: res.headers["content-type"] })
    );
    setImg(url);
  });
}

function ImageMerge() {
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [mergeImgSrc, SetMergeImgSrc] = useState();
  useEffect(() => {
    change(colorUrl, setImg1);
    change(cropUrl, setImg2);
  }, []);

  //   const merge = async () =>
  //     await mergeImages(
  //       [
  //         { src: img1, x: 0, y: 0 },
  //         { src: img2, x: 5, y: 0 },
  //       ],
  //       { width: 128, height: 128 }
  //     )
  //       .then((b64: any) => {
  //         console.log("b64 : " + b64);
  //         SetMergeImgSrc(b64);
  //       })
  //       .catch((e) => console.log(e.message));

  useEffect(() => {
    // merge();
    mergeImages(
      [
          { src: img1, x: 0, y: 0 },
          { src: img2, x: 5, y: 0 },
      ],
      { width: 128, height: 128 }
    )
      .then((b64: any) => {
        console.log("b64 : " + b64);
        SetMergeImgSrc(b64);
      })
  }, [mergeImgSrc, img1, img2]);

  return (
    <div style={style}>
      <div>
        colorUrl : <img style={imageStyle} src={img1} alt="" />
      </div>
      <br />
      <br />
      <br />
      <br />
      <div>
        cropUrl : <img style={imageStyle} src={img2} alt="" />
      </div>{" "}
      <br />
      <br />
      <br />
      <br />
      <div>
        merge-result : <img style={imageStyle} src={mergeImgSrc} alt="" />
      </div>
    </div>
  );
}

export default ImageMerge;

const style = {
  marginTop: "200px",
};

const imageStyle = {
  width: "100px",
  height: "100px",
};
