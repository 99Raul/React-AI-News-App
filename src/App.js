import React, { useState, useEffect } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import NewsCards from './components/NewsCards/NewsCards';
import wordsToNumbers from 'words-to-numbers';
import Modal from './components/Modal/Modal';
import useStyles from './styles';
import alanPic from './assests/alan-ai-pic.jpeg';

const alanKey = process.env.REACT_APP_API_KEY;

const App = () => {
	const [newsArticles, setNewsArticles] = useState([]);
	const [activeArticle, setActiveArticle] = useState(0);
	const [isOpen, setIsOpen] = useState(false);

	// const [showFeedback, setShowFeedback] = useState(false);

	const classes = useStyles();

	useEffect(() => {
		alanBtn({
			key: alanKey,
			onCommand: ({ command, articles, number }) => {
				if (command === 'newHeadlines') {
					setNewsArticles(articles);
				} else if (command === 'instructions') {
					setIsOpen(true);
				} /* else if (command === 'email') {
					setShowFeedback(true);
				}  */ else if (command === 'highlight') {
					setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
				} else if (command === 'open') {
					const parsedNumber =
						number.length > 2
							? wordsToNumbers(number, { fuzzy: true })
							: number;
					const article = articles[parsedNumber - 1];

					if (parsedNumber > 20) {
						alanBtn().playText('Please try that again...');
					} else if (article) {
						window.open(article.url, '_blank');
						alanBtn().playText('Opening...');
					} else {
						alanBtn().playText('Please try that again...');
					}
				}
			},
		});
	}, []);

	return (
		<div>
			<div className={classes.logoContainer}>
				<img src={alanPic} className={classes.alanLogo} alt='logo' />
			</div>
			<Modal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				// showFeedback={showFeedback}
				// setShowFeedback={setShowFeedback}
			/>
			<NewsCards articles={newsArticles} activeArticle={activeArticle} />
		</div>
	);
};

export default App;
