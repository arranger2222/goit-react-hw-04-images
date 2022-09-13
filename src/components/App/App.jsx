import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { toast, ToastContainer } from 'react-toastify';
import { fetchImg } from '../services/api';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Modal } from 'components/Modal/Modal';
import { Container } from './App.styled';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';

export function App() {
  const [largeImageURL, setLargeImageURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [total, setTotal] = useState(0);
  const [tags, setTags] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!query) return;
    getImages(query, page);
  }, [query, page]);

  const getImages = (query, page) => {
    const perPage = 12;

    setIsLoading(true);

    fetchImg(query, page)
      .then(({ hits, totalHits }) => {
        const totalPages = Math.ceil(totalHits / perPage);

        if (hits.length === 0) {
          return toast.error('Sorry, no images found. Please, try again!');
        }

        if (page === 1) {
          toast.success(`Hooray! We found ${totalHits} images.`);
        }

        if (page === totalPages) {
          toast.info("You've reached the end of search results.");
        }

        const data = hits.map(({ id, webformatURL, largeImageURL, tags }) => {
          return {
            id,
            webformatURL,
            largeImageURL,
            tags,
          };
        });
        setImages(images => [...images, ...data]);
        setTotal(totalHits);
      })
      .catch(error => setError({ error }))
      .finally(() => setIsLoading({ isLoading: false }));
  };

  const onSearch = query => {
    setQuery(query);
    setImages([]);
    setPage(1);
    setError(null);
  };

  const onLoadMore = () => {
    setPage(page => page + 1);
  };

  const toggleModal = (largeImageURL, tags) => {
    setShowModal(!showModal);
    setLargeImageURL(largeImageURL);
    setTags(tags);
  };

  const loadImages = images.length !== 0;
  const isLastPage = images.length === total;
  const loadMoreBtn = loadImages && !isLoading && !isLastPage;

  return (
    <Container>
      {isLoading && <Loader />}
      <Searchbar onSubmit={onSearch} />
      {error && toast.error(error.message)}
      {loadImages && <ImageGallery images={images} onClick={toggleModal} />}
      {loadMoreBtn && <Button onClick={onLoadMore}>Load more</Button>}
      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={largeImageURL} alt={tags} />
        </Modal>
      )}

      <ToastContainer theme="colored" position="top-right" autoClose={3000} />
    </Container>
  );
}
