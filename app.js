import { RandomForestRegression } from 'https://cdn.jsdelivr.net/npm/ml-random-forest@2/+esm';

let model = null;

const statusEl = document.getElementById('status');
const form = document.getElementById('predict-form');
const btn = form.querySelector('button');
const resultEl = document.getElementById('result');
const predictionEl = document.getElementById('prediction');

async function init() {
    try {
        const res = await fetch('model_data.json');
        const data = await res.json();

        model = new RandomForestRegression({ nEstimators: 50, seed: 42 });
        model.train(data.X, data.y);

        statusEl.textContent = 'Model ready!';
        btn.disabled = false;
    } catch (err) {
        statusEl.textContent = 'Error loading model: ' + err.message;
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!model) return;

    const input = [
        parseFloat(document.getElementById('spotify_playlist_count').value) || 0,
        parseFloat(document.getElementById('spotify_playlist_reach').value) || 0,
        parseFloat(document.getElementById('youtube_views').value) || 0,
        parseFloat(document.getElementById('youtube_likes').value) || 0,
        parseFloat(document.getElementById('tiktok_posts').value) || 0,
        parseFloat(document.getElementById('apple_music_playlist_count').value) || 0,
        parseFloat(document.getElementById('deezer_playlist_count').value) || 0,
        parseFloat(document.getElementById('amazon_playlist_count').value) || 0,
        parseFloat(document.getElementById('explicit_track').value) || 0
    ];

    const result = model.predict([input]);
    const score = Math.min(100, Math.max(0, Math.round(result[0])));
    predictionEl.textContent = score + ' / 100';
    resultEl.classList.remove('hidden');
});

init();
