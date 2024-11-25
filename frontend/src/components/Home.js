import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4),
  minHeight: '100vh',
}));

const Header = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
}));

const CardStyled = styled(Card)({
  maxWidth: 345,
  margin: '0 auto',
});

const CardMediaStyled = styled(CardMedia)({
  height: 200,
});

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const GridItem = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Home = () => {
  const cards = [
    {
      title: 'File Upload',
      description: 'Easily upload and manage your files with our simple interface.',
      imageUrl: 'https://via.placeholder.com/500x300?text=Upload+Files',
    },
    {
      title: 'Manage Files',
      description: 'Organize your documents and access them whenever you need.',
      imageUrl: 'https://via.placeholder.com/500x300?text=Manage+Files',
    },
    {
      title: 'Share Files',
      description: 'Share your files securely with others using generated links.',
      imageUrl: 'https://via.placeholder.com/500x300?text=Share+Files',
    },
  ];

  return (
    <Root>
      <Header variant="h3">
        Welcome to File Management
      </Header>

      <Grid container spacing={4}>
        {cards.map((card, index) => (
          <GridItem item xs={12} sm={4} key={index}>
            <CardStyled>
              <CardMediaStyled
                image={card.imageUrl}
                title={card.title}
              />
              <CardContent>
                <Title variant="h6">
                  {card.title}
                </Title>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {card.description}
                </Typography>
                <ButtonStyled
                  variant="contained"
                  fullWidth
                  onClick={() => alert(`${card.title} button clicked`)}
                >
                  Learn More
                </ButtonStyled>
              </CardContent>
            </CardStyled>
          </GridItem>
        ))}
      </Grid>
    </Root>
  );
};

export default Home;