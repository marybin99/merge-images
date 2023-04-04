import React, { useEffect, useState, useRef } from "react";
import mergeImages from "merge-images";
import axios from "axios";

// const colorUrl =
//   "https://onthemars-dev.s3.ap-northeast-2.amazonaws.com/images/background-color/06.png";
// const cropUrl =
//   "https://onthemars-dev.s3.ap-northeast-2.amazonaws.com/images/vegi/01.png";

// function change(url, setImg) {
//   axios({
//     method: "GET",
//     url,
//     responseType: "blob",
//   }).then((res) => {
//     const url = window.URL.createObjectURL(
//       new Blob([res.data], { type: res.headers["content-type"] })
//     );
//     setImg(url);
//   });
// }

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

function ImageMerge() {
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [mergeImgSrc, SetMergeImgSrc] = useState();

  const baseUrl = "https://j8e207.p.ssafy.io/api/v1";
  const dna = 1020200000000000000;
  // const [colorUrl, setColorUrl] = useState("");
  // const [cropUrl, setCropUrl] = useState("");
  // const color = "01";
  const [parts, setParts] = useState<any>();
  useEffect(() => {
    axios.get(baseUrl + `/farm/mint/${dna}`).then((res) => {
      setParts(res.data);
      console.log(res.data);
    });
  }, []);

  const createNFT = async (parts: any) => {
    const colorUrl = require(`./assets/background/${parts.colorUrl}.png`);
    // const colorUrl = `./src/assets/background/${color}.png`;
    // const crop = "01";
    const cropUrl = require(`./assets/crop/${parts.cropUrl}.png`);
    const headgear = "02";
    const hgUrl = require(`./assets/headgear/${headgear}.png`);
    const eye = "01";
    const eyeUrl = require(`./assets/eye/${eye}.png`);
    const mouth = "01";
    const mouthUrl = require(`./assets/mouth/${mouth}.png`);

    const create = await mergeImages([
      { src: colorUrl, x: 0, y: 0 },
      { src: cropUrl, x: 0, y: 0 },
      { src: hgUrl, x: 0, y: 0 },
      { src: eyeUrl, x: 0, y: 0 },
      { src: mouthUrl, x: 0, y: 0 },
    ]);
    const resultImg = dataURLtoFile(create, "nft.png");

    return resultImg;
  };

  // useEffect(() => {
  //   change(colorUrl, setImg1);
  //   change(cropUrl, setImg2);
  // }, []);

  // useEffect(() => {
  //   // merge();
  //   mergeImages([
  //     { src: img1, x: 0, y: 0 },
  //     { src: img2, x: 0, y: 0 },
  //   ]).then((b64: any) => {
  //     console.log("b64 : " + b64);
  //     SetMergeImgSrc(b64);
  //   });
  // }, [mergeImgSrc, img1, img2]);

  const address = "0xfaf5529634ff723e95aaa2f0ad0ff23fb5ba0047";
  const formData = new FormData();
  formData.append("player.address", address);
  formData.append("player.harvests[0].contractAddress", '');
  formData.append("player.harvests[0].cropId", '0');
  formData.append("player.harvests[0].dna", '');
  formData.append("player.harvests[0].tokenId",'0');
  formData.append("player.harvests[0].type", '');

  // formData.append("player.harvests[0].nftImgFile", createNFT(parts));
  const handleToAxios = (fileImage: any) => {
    axios
      .post(baseUrl + "/farm/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => console.log("성공"));
  };
  useEffect(() => {
    createNFT(parts).then((file) =>
      formData.append("player.harvests[0].nftImgFile", file)
    );
    // console.log(createNFT(parts));
  }, [parts]);

  return (
    <div style={style}>
      <div>
        {/* colorUrl : <img style={imageStyle} src={colorUrl} alt="" /> */}
      </div>
      <br />
      <br />
      <br />
      <br />
      <div>
        {/* cropUrl : <img style={imageStyle} src={cropUrl} alt="" /> */}
      </div>{" "}
      <br />
      <br />
      <br />
      <button onClick={handleToAxios}>merge</button>
      <br />
      <div>
        {/* merge-result : <img style={imageStyle} src={mergeImgSrc} alt="" /> */}
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
