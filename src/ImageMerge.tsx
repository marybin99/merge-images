import React, { useEffect, useState } from "react";
import mergeImages from "merge-images";
import axios from "axios";

// const colorUrl =
//   "https://onthemars-dev.s3.ap-northeast-2.amazonaws.com/images/background-color/06.png";
// const cropUrl =
//   "https://onthemars-dev.s3.ap-northeast-2.amazonaws.com/images/vegi/01.png";

function change(url, setImg) {
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

  const baseUrl = "https://j8e207.p.ssafy.io/api/v1";
  const dna = 1020200000000000000;
  const [colorUrl, setColorUrl] = useState("");
  const [cropUrl, setCropUrl] = useState("");

  useEffect(() => {
    axios.get(baseUrl + `/farm/mint/${dna}`).then((res) => {
      setColorUrl(res.data.colorUrl);
      setCropUrl(res.data.cropUrl);
    });
  });

  useEffect(() => {
    change(colorUrl, setImg1);
    change(cropUrl, setImg2);
  }, []);

  useEffect(() => {
    // merge();
    mergeImages([
      { src: img1, x: 0, y: 0 },
      { src: img2, x: 0, y: 0 },
    ]).then((b64: any) => {
      console.log("b64 : " + b64);
      SetMergeImgSrc(b64);
    });
  }, [mergeImgSrc, img1, img2]);

  
  const handleToMerge = () => {
    console.log('merge');
    mergeImages([
      { src: img1, x: 0, y: 0 },
      { src: img2, x: 0, y: 0 },
    ]).then((b64: any) => {
      console.log("b64 : " + b64);
      SetMergeImgSrc(b64);
    });
  };

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
      <button onClick={handleToMerge}>merge</button>
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
  marginBottom: "100px",
};

const imageStyle = {
  width: "100px",
  height: "100px",
};
