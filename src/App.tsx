import { useState } from 'react';
import './App.css';

interface GitHubUserData {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  const [query, setQuery] = useState<string>('');
  const [profile, setProfile] = useState<GitHubUserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  async function findProfile() {
    if (query.trim() === '') {
      setErrorMessage('Please enter a username');
      setProfile(null);
      return;
    } 
    setLoading(true);
    setErrorMessage('');
    setProfile(null);

    try {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('User not found!');
      }

      const data: GitHubUserData = await response.json();
      setProfile(data);
    }
    catch (error: any) {
      console.error('Error fetching data: ', error);
      setErrorMessage(error.message);
    }
    finally {
      setLoading(false);
    }
  }  
  return (
    <div className='app-container'>
      <div className='theme-toggle'>
        <button className='theme-toggle-btn' onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
      <h1>Github Profile Finder</h1>

      <div id='searchArea'>
        <input type='type' placeholder='Search Global Usernames...' value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && findProfile()}/>
        <button onClick={findProfile}>Search</button>
      </div>

      {errorMessage && <p className='error-text'>{errorMessage}</p>}
      {loading && <p className='loading-text'>Loading profile metadata...</p>}

      {profile && (
        <div className='profile-card'>
          <img src={profile.avatar_url} alt='Profile Picture'/>
          <h4>Username: {profile.login}</h4>
          <h5>Name: {profile.name || 'Not Available'}</h5>

          <p>Bio: {profile.bio === null ? <i>'This user has no bio'</i> : profile.bio}</p>
          <p>Followers: {profile.followers}</p>
          <p>Following: {profile.following}</p>
          <p>Public Repositories: {profile.public_repos}</p>

          <a href={profile.html_url} target='_blank' rel='noreferrer'> View Github Portfolio</a>
        </div>
      )}
    </div>  
  );  
}