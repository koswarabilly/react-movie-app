// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  HStack,
  Heading,
  Input,
  Button,
  Box,
  AspectRatio,
  Image,
  Stack,
  Text,
  Pressable,
  FlatList,
  Modal,
} from 'native-base';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../app/store';
import { bindActionCreators } from '@reduxjs/toolkit';
import { Movie, updateList } from '../../app/movie';
import { connect } from 'react-redux';
import { searchMovie } from '../../services/movie.service';

function useOnScreen(ref: any) {

  const [isIntersecting, setIntersecting] = useState(false);

  const observer = new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting)
  );

  useEffect(() => {
    observer.observe(ref.current)
    return () => { observer.disconnect() }
  }, []);

  return isIntersecting;
}

const List = (props: any) => {
  const { movies: { list, total, page, s }, actions } = props;

  const history = useHistory();
  const loadMoreRef = useRef();
  const needLoadMore = useOnScreen(loadMoreRef);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [focused, setFocused] = useState<any>({});

  useEffect(() => {
    setSearch(s);
  }, []);

  useEffect(() => {
    if (list.length < total && !loading && needLoadMore && !showModal) {
      actions.updateList({ page: page + 1 });
    }
  }, [needLoadMore]);

  useEffect(() => {
    if (total > 0 && page > 1) {
      return onSearch(true);
    }
  }, [page]);

  const resetList = () => {
    actions.updateList({ list: [], total: 0, page: 1 });
  };

  const onSearch = async (append?: boolean) => {
    setLoading(true);
    const response = await searchMovie(search, year, append ? page : 1);
    if (response.status !== 200) {
      return;
    }
    const result = response.data;
    if (result["Response"] === "True") {
      const updatedList = append ? [...list, ...result["Search"]] : result["Search"];
      actions.updateList({ list: updatedList, total: result["totalResults"], page: append ? page : 1 });
    }
    setLoading(false);
  };

  const handleSearchChange = (event: any) => {
    setSearch(event.target.value);
    actions.updateList({ s: search });
  };

  const isSecondAndFourth = (index: number) => {
    if (index < 5) {
      if (index === 1 || index === 3) {
        return true;
      }
      return false;
    } else {
      if ((index - 1) % 5 === 0 || (index - 3) % 5 === 0) {
        return true;
      }
      return false;
    }
  };

  const renderMovieBox = (movie: Movie, index: number) => {
    const margin = isSecondAndFourth(index) ? "calc(0.025 * 70vw)" : "0";
    const imgUri = {
      uri: movie.Poster === 'N/A' ? "https://i.stack.imgur.com/y9DpT.jpg" : movie.Poster,
    };
    return (
      <Pressable
        key={index}
        rounded="md"
        borderColor="coolGray.200"
        borderWidth="1"
        w={"calc(0.18 * 70vw)"}
        ml={margin}
        mr={margin}
        mb={4}
        >
          <Box w={"calc(0.18 * 70vw)"}>
            <AspectRatio ratio={9 / 16}>
              <>
              {
                !loading &&
                <Image
                  source={imgUri}
                  alt="poster"
                  w="100%"
                  h="100%"
                  onClick={() => {
                    if (movie.Poster !== 'N/A') {
                      setFocused(movie)
                      setShowModal(true);
                    }
                  }}
                />
              }
              </>
            </AspectRatio>
          </Box>
          <Stack
            p="4" 
            space={3}
            onClick={() => {
              actions.updateList({ s: search });
              history.push(`/detail/${movie.imdbID}`);
            }}
          >
            <Text>{movie.Year}</Text>
            <Heading size="md">{movie.Title}</Heading>
          </Stack>
      </Pressable>
    );
  };

  return (
    <Container w={{
      base: '70%'
    }}>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content minH="90vh" >
          <Modal.CloseButton />
          <Modal.Header>{focused.Title}</Modal.Header>
          <Modal.Body>
            <Box w="100%">
              <AspectRatio ratio={9 / 16}>
                <Image
                  source={{
                    uri: focused.Poster === 'N/A' ? "https://i.stack.imgur.com/y9DpT.jpg" : focused.Poster
                  }}
                  alt="poster"
                  w="100%"
                  h="100%"
                />
              </AspectRatio>
              </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <HStack w="100%" mb="8">
        <Heading>Movies</Heading>
        <Input
          mx="4"
          placeholder="Movie title"
          w="100%"
          value={search}
          onChange={handleSearchChange}
          onSubmitEditing={() => {
            resetList();
            onSearch(false);
          }}
        />
        <Button onPress={() => {
          resetList();
          onSearch(false);
        }} isLoading={loading}>
          Search
        </Button>
      </HStack>
      {
        list.length > 0 &&
        <Text fontSize="md" bold mb={4}>Result {list.length} of {total}</Text>
      }
      {
        !showModal &&
        <FlatList
          contentContainerStyle={[{ width: '100%' }]}
          numColumns={5}
          data={list}
          renderItem={({item, index}: any) => renderMovieBox(item, index)}
        />
      }
      <div ref={loadMoreRef} />
    </Container>
  );
}

const mapStateToProps = (state: RootState) => ({
  movies: state.movies,
});

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators({ updateList }, dispatch),
});

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(List);
