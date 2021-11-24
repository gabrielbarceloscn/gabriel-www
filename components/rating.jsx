import { AiFillStar } from "react-icons/ai";
import styles from './rating.module.scss'
import {Flex} from "@chakra-ui/react";

const MAX_RATING = 5

const Rating = ({ rating }) => (
    <Flex direction={"row"} className={styles.rating}>
        {Array.from(Array(MAX_RATING).keys()).map((_, i) => (
            <AiFillStar className={i < rating ? styles.filledStar : styles.star} key={String(i)} />
        ))}
    </Flex>
)

export default Rating
