import { Text, Image, Card, CardSection } from "@mantine/core";
import { useEffect } from "react";
import classes from "./ccard.module.css";
import NextImage from "next/image";
import { Flex } from "@mantine/core";

export const CCard = ({ name, url }: any) => {
  return (
    <Flex direction={"column"} className={`${classes.category_card_container}`}>
      <Image
        alt=""
        src={url}
        component={NextImage}
        fit="contain"
        w={100}
        h={100}
        className={`${classes.image}`}
      />
      <Flex
        style={{ flex: 2 }}
        wrap={"wrap"}
        align={"center"}
        justify={"center"}
      >
        <Text className={`${classes.text}`}>{name}</Text>
      </Flex>
    </Flex>

    // <Card>
    //   <CardSection>
    //     <Image
    //       alt=""
    //       src={url}
    //       component={NextImage}
    //       fit="contain"
    //       // w={100}
    //       // h={100}
    //       // className={`${classes.image}`}
    //     />
    //   </CardSection>
    //   <Text className={`${classes.text}`}>{name}</Text>
    // </Card>
  );
};
