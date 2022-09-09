import 'react-toastify/dist/ReactToastify.css';
import { Component } from 'react';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { toast, ToastContainer } from 'react-toastify';
import { fetchImg } from '../services/api';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Modal } from 'components/Modal/Modal';
import { Container } from './App.styled';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';

export class App extends Component {
  state = {
    page: 1,
    query: '',
    images: [],
    isLoading: false,
    error: null,
    total: 0,
    showModal: false,
    largeImageURL: null,
  };

  componentDidUpdate(_, prevState) {
    const prevQuery = prevState.query;
    const nextQuery = this.state.query;
    const { page } = this.state;

    if (prevQuery !== nextQuery || (prevState.page !== page && page !== 1)) {
      this.getImages();
    }
  }

  getImages = () => {
    const { query, page } = this.state;
    const perPage = 12;

    this.setState({ isLoading: true });

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
        this.setState(({ images }) => ({
          images: [...images, ...data],
          total: totalHits,
        }));
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ isLoading: false }));
  };

  onSearch = query => {
    if (query === this.state.query) return;
    this.setState({
      images: [],
      query,
      page: 1,
      error: null,
    });
  };

  onLoadMore = () => {
    this.setState(({ page }) => ({
      page: page + 1,
      isLoading: true,
    }));
  };

  toggleModal = largeImageURL => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
    this.setState({ largeImageURL: largeImageURL });
  };

  render() {
    const { images, error, isLoading, total, showModal, largeImageURL, tags } =
      this.state;
    const loadImages = images.length !== 0;
    const isLastPage = images.length === total;
    const loadMoreBtn = loadImages && !isLoading && !isLastPage;
    return (
      <Container>
        {isLoading && <Loader />}
        {/* {this.state.isLoading && <div>LOADING</div>} */}
        <Searchbar onSubmit={this.onSearch} />
        {error && toast.error(error.message)}
        {loadImages && (
          <ImageGallery images={images} onClick={this.toggleModal} />
        )}

        {loadMoreBtn && <Button onClick={this.onLoadMore}>Load more</Button>}

        {showModal && (
          <Modal onClose={this.toggleModal}>
            <img src={largeImageURL} alt={tags} />
          </Modal>
        )}

        <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      </Container>
    );
  }
}
