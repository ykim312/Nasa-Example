import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

export default function Polychromatic() {
  const [image, setImage] = useState([]);
  const [images, setImages] = useState([]);
  const [time, setTime] = useState("loading");
  const [date, setDate] = useState("");
  const [coords, setCoords] = useState({});

  const apiKey = "CmQHjbitPaDxuOxhMTHQGhAbIrggR0TwrptwhUSh";
  const url = `https://epic.gsfc.nasa.gov/api/natural?api_key=${apiKey}`;

  const getPolychromaticData = async () => {
    const res = await axios.get(url);
    const data = await res.data;
    console.log(data);

    const caption = data[0].caption;
    const date = data[0].date.split(" ")[0];
    const date_formatted = date.replaceAll("-", "/");

    let times = [];
    let images = [];

    for (let i = 0; i < date.length; i++) {
      let time = data[i].date.split(" ")[1];
      let coords = data[i].centroid_coordinates;
      let imageGrabbed = data[i].image;
      let image = `https://epic.gsfc.nasa.gov/archive/natural/${date_formatted}/png/${imageGrabbed}.png`;

      times.push(time);
      images.push({
        image: image,
        time: time,
        coords: coords,
      });
    }

    setDate(date);
    setImages(images);
    setImage(images[0].image);
    setTime(times[0]);
    setCoords([images[0].coords.lat, images[0].coords.lon]);

    console.log(image);
  };

  useEffect(() => {
    getPolychromaticData();
  }, []);

  return (
    <>
      Earth Polychromatic
      <div className={styles.earthcover}>
        <Image
            src={image}
            alt={image}
            width={500}
            height={500}
            className={styles.earth}
        />
      </div>
        <div className={styles.maintext}>
      </div>
      <table>
        <thead>
          <tr className={styles.text}>
            <th>Time</th>
            <div>{time}</div>
            <th>Latitude, Longitude</th>
            <div>
            {coords[0]}, {coords[1]}
            </div>
            <th></th>
          </tr>
        </thead>
        <tbody className={styles.earthmain}>
          {images.map((e, i) => {
            return (
              <tr key={i}>
                <td>{e.time}</td>
                <td>{e.coords.lat}</td>
                <td>{e.coords.lon}</td>
                <div className={styles.earthcover}>
                    <td>
                    <Image src={e.image} alt={i} width={200} height={200} className={styles.earthchange}/>
                    </td>
                    <td>
                    <button
                        onClick={() => {
                        setImage(e.image);
                        setTime(e.time);
                        setCoords([e.coords.lat, e.coords.lon]);
                        console.log(images[i].image);
                        document.body.scrollIntoView();
                        }}
                        className={styles.earthbutton}
                    >
                        View
                    </button>
                </td>
                </div>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
