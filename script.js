// 1. ELEMEN DOM UTAMA
const languageSelect = document.getElementById('language-select');
const refreshBtn = document.getElementById('refresh-btn');
const retryBtn = document.getElementById('retry-btn');

// Elements State Views
const stateEmpty = document.getElementById('state-empty');
const stateLoading = document.getElementById('state-loading');
const stateError = document.getElementById('state-error');
const stateSuccess = document.getElementById('state-success');

// Elements Detail Repo
const repoName = document.getElementById('repo-name');
const repoDesc = document.getElementById('repo-desc');
const repoLang = document.getElementById('repo-lang');
const repoStars = document.getElementById('repo-stars');
const repoForks = document.getElementById('repo-forks');
const repoIssues = document.getElementById('repo-issues');

// 2. EVENT LISTENERS
languageSelect.addEventListener('change', () => {
    fetchRandomRepo();
});

refreshBtn.addEventListener('click', () => {
    fetchRandomRepo();
});

retryBtn.addEventListener('click', () => {
    fetchRandomRepo();
});

// 3. FUNGSI FETCH DATA DARI GITHUB API
async function fetchRandomRepo() {
    const selectedLanguage = languageSelect.value;
    if (!selectedLanguage) return;

    switchState('loading');

    // Trik mendapatkan data acak: Acak halaman (page 1 sampai 5) dengan 20 item per halaman
    const randomPage = Math.floor(Math.random() * 5) + 1;
    const url = `https://api.github.com/search/repositories?q=language:${encodeURIComponent(selectedLanguage)}&sort=stars&order=desc&per_page=20&page=${randomPage}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Gagal mengambil data dari GitHub API');
        }

        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            // Pilih satu indeks repositori secara acak dari array yang didapat
            const randomIndex = Math.floor(Math.random() * data.items.length);
            const randomRepo = data.items[randomIndex];
            
            // Tampilkan ke antarmuka
            displayRepoData(randomRepo);
            switchState('success');
        } else {
            // Jika hasil pencarian kosong
            switchState('error');
        }
    } catch (error) {
        console.error(error);
        switchState('error');
    }
}

// 4. MEMASUKKAN DATA KE UI
function displayRepoData(repo) {
    repoName.innerText = repo.full_name;
    repoDesc.innerText = repo.description || 'No description provided for this repository.';
    repoLang.innerText = repo.language;
    repoStars.innerText = repo.stargazers_count.toLocaleString();
    repoForks.innerText = repo.forks_count.toLocaleString();
    repoIssues.innerText = repo.open_issues_count.toLocaleString();
}

// 5. MANAJEMEN SWITCH STATE UI
function switchState(state) {
    // Sembunyikan semua state terlebih dahulu
    stateEmpty.classList.add('hide');
    stateLoading.classList.add('hide');
    stateError.classList.add('hide');
    stateSuccess.classList.add('hide');
    refreshBtn.classList.add('hide');

    // Tampilkan state yang dituju
    if (state === 'empty') {
        stateEmpty.classList.remove('hide');
    } else if (state === 'loading') {
        stateLoading.classList.remove('hide');
    } else if (state === 'error') {
        stateError.classList.remove('hide');
    } else if (state === 'success') {
        stateSuccess.classList.remove('hide');
        refreshBtn.classList.remove('hide'); // Tombol refresh muncul saat sukses
    }
}