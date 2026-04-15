let modelData = null;

const statusEl = document.getElementById('status');
const form = document.getElementById('predict-form');
const btn = form.querySelector('button');
const resultEl = document.getElementById('result');
const predictionEl = document.getElementById('prediction');

async function init() {
    try {
        const res = await fetch('model_data.json');
        modelData = await res.json();

        statusEl.textContent = 'Model ready!';
        btn.disabled = false;
        btn.removeAttribute('aria-disabled');
    } catch (err) {
        statusEl.textContent = 'Error loading model: ' + err.message;
    }
}

function predict(rawInput) {
    // Apply StandardScaler: (x - mean) / scale
    const scaled = rawInput.map((val, i) =>
        (val - modelData.scaler_mean[i]) / modelData.scaler_scale[i]
    );
    // Dot product with coefficients + intercept
    let result = modelData.intercept;
    for (let i = 0; i < scaled.length; i++) {
        result += scaled[i] * modelData.coef[i];
    }
    return result;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!modelData) return;

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

    const score = Math.min(100, Math.max(0, Math.round(predict(input))));
    predictionEl.textContent = score + ' / 100';
    resultEl.classList.remove('hidden');
});

init();
