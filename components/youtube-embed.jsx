import {Box} from "@chakra-ui/react";
import styles from "./youtube-embed.module.scss";

const YoutubeEmbed = ({embedId, title}) => {

    return (
        <Box className={styles.videoResponsive}>
            <iframe
                width="100%"
                height="480"
                src={`https://www.youtube.com/embed/${embedId}`}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={title}
            />
        </Box>
    )
}

export default YoutubeEmbed;