const form = document.querySelector('.search-container');
const input = document.querySelector('.input');
const defSection = document.querySelector('.definition-section');
const defList = document.querySelector('.definition');
const message = document.querySelector('#message');
/* Render List */
const renderData = (word, meaning , phonetic) => {
	defSection.innerHTML = `
	            <ul class="definition"> 
				    <li class="list-item word">
				      <i class="fa-solid fa-volume-up"></i>
				      <h2>${word}</h2>
				      <p>${(phonetic == undefined) ? "":phonetic}</p>
			        </li>
			    	   ${meaning.map(mean => {
			    		   return `<li class="list-item">
			    		   <p><b>${mean.partOfSpeech}</b></p>
			    		   <p>${mean.definitions[0].definition}</p>
			    		   </li>`;
			    	    }).join('')}
			    </ul>`;
}

form.addEventListener("submit", (e) => {
	e.preventDefault();
	if (input.value == '') {
		message.innerText = "Please enter a word!";
	} else {
	const word = document.querySelector('.input').value;
    const URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`;
    message.style.display = 'block';
    message.innerText = "searching...";
    /* Fetching API */
    fetch(URL)
    .then((response) => response.json())
    .then((data) => {
    	/* Items from the Api */
    	const wordObject = data[0];
    	const word = wordObject.word;
    	const meaning = wordObject.meanings;
    	const phonetic = wordObject.phonetics[0].text;
    	/* For removing empty audio property*/
    	const audioLinkContainer = wordObject.phonetics.filter(phone => {
    		return phone.audio.includes('https');
    	});
    	const audioLink = audioLinkContainer[0].audio;
    	console.log(audioLink);
    	const audio = new Audio(audioLink);
    	renderData(word, meaning, phonetic);
    	const audioplayer = document.querySelector('.fa-volume-up');
    	/* For Playing Sound */
		audioplayer.addEventListener('click', () => {
			if (audio.src === undefined) {
	            message.innerText = 'Sound is not available for this word!'
			} else {
				audio.play();
			}
        });
        message.innerText = '';
    })
    .catch((err) => {message.innerText = "couldn't find the word, please check your word and try again!"
    	defSection.innerHTML = '';});
    input.value = '';
}});