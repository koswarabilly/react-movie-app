// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  Container,
  Heading,
  Text,
  HStack,
  VStack,
  Box,
  AspectRatio,
  Image,
  IconButton,
  ArrowBackIcon,
} from 'native-base';
import { getMovieById } from '../../services/movie.service';
import { useHistory, useParams } from 'react-router-dom';
import { MovieDetail } from '../../app/movie';

const Detail = (props: any) => {

  const history = useHistory();
  const { id }: any = useParams();

  const [movieDetail, setMovieDetail] = useState<MovieDetail>({
    "Title": "",
    "Year": "",
    "Rated": "",
    "Released": "",
    "Runtime": "",
    "Genre": "",
    "Director":  "",
    "Writer": "",
    "Actors": "",
    "Plot": "",
    "Language": "",
    "Country": "",
    "Awards": "",
    "Poster": "",
    "Ratings": [
    ],
    "Metascore": "",
    "imdbRating": "",
    "imdbVotes": "",
    "imdbID": "",
    "Type": "",
    "DVD": "",
    "BoxOffice": "",
    "Production": "",
    "Website": "",
    "Response": "True"
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getMovie();
  }, []);

  const getMovie = async () => {
    setLoading(true);
    const response = await getMovieById(id);
    if (response.status !== 200) {
      return;
    }
    const result = response.data;
    if (result["Response"] !== "False") {
      setMovieDetail(result as MovieDetail);
    }
    setLoading(false);
  };

  return (
    <Container w={{
      base: '70%'
    }}>
      {
        !loading &&
        <HStack w="100%" h="100%">
          <VStack w="30%">
            <Box>
              <IconButton
                icon={<ArrowBackIcon size={8} />}
                size={8}
                mb={4}
                onPress={() => {
                  history.push(`/`);
                }}
              />
            </Box>
            <Box w="100%">
              <AspectRatio ratio={9 / 16}>
                <>
                {
                  !loading &&
                  <Image
                    source={{
                      uri: movieDetail.Poster === 'N/A' ? "https://i.stack.imgur.com/y9DpT.jpg" : movieDetail.Poster
                    }}
                    alt="poster"
                    w="100%"
                    h="100%"
                  />
                }
                </>
              </AspectRatio>
            </Box>
          </VStack>
          <VStack w="60%" ml={8}>
            <Heading>{movieDetail.Title}</Heading>
            <Text>{movieDetail.Plot}</Text>
            <Heading size="md" mt={8}>Detail</Heading>
            <Text>Ratings: {movieDetail.imdbRating}</Text>
            <Text>Released on: {movieDetail.Released}</Text>
            <Text>Genre: {movieDetail.Genre}</Text>
            <Text>Runtime: {movieDetail.Runtime}</Text>
            <Text>Language: {movieDetail.Language}</Text>
            <Heading size="md" mt={8}>Production</Heading>
            <Text>Production: {movieDetail.Production}</Text>
            <Text>Writer: {movieDetail.Writer}</Text>
            <Text>Director: {movieDetail.Director}</Text>
            <Text>Actors: {movieDetail.Actors}</Text>
            <Heading size="md" mt={8}>Honory</Heading>
            <Text>Awards: {movieDetail.Awards}</Text>
            <Text>Box office: {movieDetail.BoxOffice}</Text>
          </VStack>
        </HStack>
      }
    </Container>
  );
};

export default Detail;
