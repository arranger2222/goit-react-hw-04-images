import PropTypes from 'prop-types';
import { GalleryItem, GalleryItemImg } from './ImageGalleryItem.styled';

export const ImageGalleryItem = ({
  webformatURL,
  largeImageURL,
  tags,
  onClick,
}) => (
  <GalleryItem
    onClick={() => {
      onClick(largeImageURL);
    }}
  >
    <GalleryItemImg src={webformatURL} alt={tags} />
  </GalleryItem>
);

ImageGalleryItem.propTypes = {
  webformatURL: PropTypes.string.isRequired,
  largeImageURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

// export const Gallery = ({ images, onClick }) => {
//   return (
//     <ul style={{ listStyleType: 'none' }}>
//       {images.map(image => (
//         <li
//           key={image.id}
//           onClick={() => {
//             onClick(image.largeImageURL);
//           }}
//         >
//           <img src={image.webformatURL} alt={image.tags} width="100px" />
//         </li>
//       ))}
//     </ul>
//   );
// };
