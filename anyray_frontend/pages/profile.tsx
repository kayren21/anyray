import axios from 'axios';
import Navbar from './components/navigation';
import styles from '@/styles/Profile.module.css';
import { Poppins } from 'next/font/google';
import { Caveat } from 'next/font/google';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

const caveat = Caveat({ subsets: ['latin'], weight: ['500'], variable: '--font-caveat' });
const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'], variable: '--font-poppins' });

interface Language {
  id: string;
  name: string;
}

interface Country {
  id: string;
  name: string;
}

interface User {
  firstName?: string;
  lastName?: string;
  email: string;
  gender?: string;
  dob?: string;
  translationLanguage?: Language;
  homeCountry?: Country;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const [userRes, langRes, countryRes] = await Promise.all([
          axios.get(`http://localhost:3000/users/${userId}`),
          axios.get(`http://localhost:3000/languages`),
          axios.get(`http://localhost:3000/countries`),
        ]);
        setUserData(userRes.data);
        setLanguages(langRes.data);
        setCountries(countryRes.data);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!userData) return;
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !userData) return;

    setSaving(true);
    try {
      await axios.patch(`http://localhost:3000/users/${userId}`, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        gender: userData.gender,
        dob: userData.dob,
        translationLanguageId: userData.translationLanguage?.id,
        homeLandId: userData.homeCountry?.id,
        ...(newPassword && currentPassword && {
          password: newPassword,
          currentPassword,
        }),
      });
      setEditMode(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${styles.page} ${poppins.variable} ${caveat.variable}`}>
      <Navbar />
      <main className={styles.content}>
        {loading ? (
          <p>Loading...</p>
        ) : userData ? (
          <div className={styles.profileCard}>
            <div className={styles.headerRow}>
              <h2 className={styles.cardTitle}>Your Profile</h2>
              <div className={styles.buttonGroup}>
                {editMode ? (
                    <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                    </button>
                ) : (
                    <button className={styles.editButton} onClick={() => setEditMode(true)}>Update</button>
                )}
                 <span className={`${styles.savedText} ${saved ? styles.visible : ''}`}>✔</span>
                </div>


     </div>
            

            <form className={styles.profileForm}>
              <label>First Name:
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </label>

              <label>Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </label>

              <label>Email:
                <input type="email" value={userData.email} readOnly />
              </label>

              <label>Date of Birth:
                <DatePicker
                  selected={userData.dob ? new Date(userData.dob) : null}
                  onChange={(date: Date | null) => {
                    if (date) {
                      setUserData({ ...userData, dob: date.toISOString().split('T')[0] });
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select your birth date"
                  disabled={!editMode}
                />
              </label>

              <label>Gender:
                <select  className={styles.selectNoArrow}
                  name="gender"
                  value={userData.gender || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                >
                  <option value="">Not specified</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label>Select your translation language:
                <select className={styles.selectNoArrow}
                  name="translationLanguage"
                  value={userData.translationLanguage?.id || ''}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      translationLanguage: {
                        id: e.target.value,
                        name: languages.find((lang) => lang.id === e.target.value)?.name || '',
                      },
                    })
                  }
                  disabled={!editMode}
                >
                  <option value="">Select a language</option>
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
              </label>

              <label>Select your homeland:
                <Select 
                  value={
                    countries.find(c => c.id === userData.homeCountry?.id)
                      ? {
                          value: userData.homeCountry!.id,
                          label: userData.homeCountry!.name,
                        }
                      : null
                  }
                  options={countries.map(c => ({ value: c.id, label: c.name }))}
                  onChange={(option) =>
                    setUserData({
                      ...userData,
                      homeCountry: {
                        id: option?.value || '',
                        name: option?.label || '',
                      },
                    })
                  }
                  isDisabled={!editMode}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: 'rgba(255, 255, 255, 0.68)',
                      borderRadius: '10px',
                      borderColor: state.isFocused ? '#ccc' : 'rgba(0, 0, 0, 0.1)',
                      boxShadow: 'none',
                      fontSize: '15px',
                      padding: '2px 6px',
                      fontWeight: '400px',
                      '&:hover': {
                        borderColor: '#36dafd',
                      }
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: '#222',
                      fontWeight: 400,
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 5,
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? '#e6f7ff'
                        : state.isFocused
                        ? '#f2faff'
                        : 'white',
                      color: '#222',
                      fontWeight: 400,
                      cursor: 'pointer',
                    }),
                    indicatorSeparator: () => ({
                      display: 'none',
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: '#aaa',
                    }),
                    placeholder: (base) => ({
                        ...base,
                        fontWeight: 400,
                      }),
                      
                      
                  }}
                />
              </label>

              {editMode && (
                <>
                  <label>Current Password:
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </label>

                  <label>New Password:
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Leave empty if not changing"
                    />
                  </label>
                </>
              )}
            </form>
          </div>
        ) : (
          <p>Profile not found.</p>
        )}
      </main>
    </div>
  );
}
