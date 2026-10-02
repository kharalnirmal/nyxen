"use client";

import Image from "next/image";
import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import styles from "./work.module.css";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);

  const showVideo = () => setIsVideo(Boolean(props.video));
  const hideVideo = () => setIsVideo(false);

  const media = (
    <>
      {props.link && (
        <span className={styles.workLink} aria-hidden="true">
          <MdArrowOutward />
          <MdArrowOutward />
        </span>
      )}
      <Image
        src={props.image}
        alt={props.alt ?? ""}
        fill
        sizes="(max-width: 900px) 290px, (max-width: 1400px) 350px, 440px"
      />
      {isVideo && props.video && (
        <video
          src={props.video}
          poster={props.image}
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          aria-hidden="true"
        />
      )}
    </>
  );

  return (
    <div className={styles.workImage}>
      {props.link ? (
        <a
          className={styles.workImageIn}
          href={props.link}
          onMouseEnter={showVideo}
          onMouseLeave={hideVideo}
          onFocus={showVideo}
          onBlur={hideVideo}
          target="_blank"
          rel="noreferrer"
          data-cursor="disable"
        >
          {media}
        </a>
      ) : (
        <div
          className={styles.workImageIn}
          onMouseEnter={showVideo}
          onMouseLeave={hideVideo}
        >
          {media}
        </div>
      )}
    </div>
  );
};

export default WorkImage;
