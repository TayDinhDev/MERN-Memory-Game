import React, { useState, useEffect } from "react";
import styled from "styled-components";
import image1 from '../assets/image1.JPG';
import image2 from '../assets/image2.JPG';
import image3 from '../assets/image3.JPG';
import image4 from '../assets/image4.JPG';
import image5 from '../assets/image5.JPG';
import image6 from '../assets/image6.JPG';
import image7 from '../assets/image7.JPG';
import image8 from '../assets/image8.JPG';
import image9 from '../assets/image9.JPG';

export default function Welcome() {
  const [userName, setUserName] = useState("");
  const [newMessage, setNewMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        if (userData && userData.username) {
          setUserName(userData.username);
        } else {
          setUserName("Guest");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <h1>Welcome, {userName}</h1>
      {newMessage && <Notification>{newMessage}</Notification>}
      <Game setNewMessage={setNewMessage} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
`;

function Game({ setNewMessage }) {
  const [cards, setCards] = useState([]);
  const [flippedCardIds, setFlippedCardIds] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState([]);

  useEffect(() => {
    const images = [image1, image2, image3, image4, image5, image6, image7, image8];
    const shuffledImages = [...images, ...images].sort(() => Math.random() - 0.5);
    setCards(shuffledImages.map((image, index) => ({ id: index, image, isFlipped: false, isMatched: false })));
  }, []);

  const handleCardClick = (id) => {
    if (flippedCardIds.length === 2 || gameOver) return;

    const newCards = cards.map(card => {
      if (card.id === id && !card.isFlipped) {
        return { ...card, isFlipped: true };
      }
      return card;
    });

    setCards(newCards);
    setFlippedCardIds([...flippedCardIds, id]);
  };

  useEffect(() => {
    if (flippedCardIds.length === 2) {
      const [card1Id, card2Id] = flippedCardIds;
      const card1 = cards.find(card => card.id === card1Id);
      const card2 = cards.find(card => card.id === card2Id);

      if (card1.image === card2.image) {
        setMatchedPairs([...matchedPairs, card1.image]);
        if (matchedPairs.length + 1 === cards.length / 2) {
          setGameOver(true);
          setNewMessage("Congratulations! You've won!");
        }
      } else {
        setTimeout(() => flipBackUnmatchedCards(card1Id, card2Id), 500);
      }

      setFlippedCardIds([]);
    }
  }, [flippedCardIds, cards, matchedPairs, setNewMessage]);

  const flipBackUnmatchedCards = (card1Id, card2Id) => {
    const newCards = cards.map(card => {
      if (card.id === card1Id || card.id === card2Id) {
        return { ...card, isFlipped: false };
      }
      return card;
    });

    setCards(newCards);
  };

  return (
    <div>
      <br />

      <h2>Game Lật Mèo</h2>
      <br />
      <div className="card-container">
    {cards.map(card => (
      <Card
        key={card.id}
        isFlipped={card.isFlipped}
        onClick={() => handleCardClick(card.id)}
      >
        {card.isFlipped || card.isMatched ? (
          <img src={card.image} alt="Card" style={{ width: '100%', height: '100%' }} />
        ) : (
          <img src={image9} alt="Default" style={{ width: '100%', height: '100%' }} />
        )}
      </Card>
    ))}
  </div>

      {gameOver && <h3>Congratulations! You've won!</h3>}
    </div>
  );
}


const Card = styled.div`
  width: 100px;
  height: 100px;
  margin: 10px;
  perspective: 600px;
  cursor: pointer;
  background-color: ${props => (props.isFlipped ? "#ffffff" : "#ddd")};
  transform: ${props => (props.isFlipped ? "rotateY(180deg)" : "none")};
  transition: transform 0.5s;
  display: inline-block;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  position: relative; /* Thêm thuộc tính position */
  overflow: hidden; /* Ẩn phần nằm ngoài kích thước của thẻ */
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* Đảm bảo hình ảnh vừa với kích thước của thẻ */
  position: absolute; /* Đặt vị trí tuyệt đối để kiểm soát */
  top: 0;
  left: 0;
  transition: opacity 0.5s; /* Thêm hiệu ứng khi ảnh hiển thị */
  opacity: ${props => (props.isFlipped ? 1 : 0)}; /* Ẩn ảnh khi chưa lật */
`;

const Notification = styled.div`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
`;
