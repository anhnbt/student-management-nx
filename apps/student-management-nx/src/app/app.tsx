// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import styles from './app.module.scss';
import NxWelcome from './nx-welcome';

interface SinhVien {
  id?: number;
  ma?: string;
  hovaten?: string;
  email?: string;
  username?: string;
  password?: string;
}

export function App() {

  const [sinhViens, setSinhViens] = useState<SinhVien[]>([]);

  const [sv, setSv] = useState<SinhVien>({});

  useEffect(() => {
    fetch('http://localhost:3000/api/sinhvien')
      .then((_) => _.json())
      .then(setSinhViens);
  }, []);

  const handleChange = (key: string, value: string | undefined) => {
    console.log(key, value);
    setSv({...sv, [key]: value});
  }

  function addSinhVien() {
    console.log(sv);

    fetch('http://localhost:3000/api/sinhvien', {
      method: 'POST',
      body: JSON.stringify(sv),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((_) => _.json())
      .then((newSv) => {
        console.log(newSv);
        setSinhViens([
          ...sinhViens,
          newSv
        ]);
      });
  }

  function deleteSinhvien(id: number | undefined) {
    fetch(`http://localhost:3000/api/sinhvien/${id}`, {
      method: 'DELETE',
    })
      .then((_) => _.json())
      .then((res) => {
        console.log(res);
      });
  }

  function editSinhvien(id: number | undefined) {
    fetch(`http://localhost:3000/api/sinhvien/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sv),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((_) => _.json())
      .then((res) => {
        console.log(res);
      });
  }

  return (
    <>
      <h1>Sinh vien</h1>
      <ul>
        {sinhViens.map((s) => (
          <li className={'sv'}>
            {s.hovaten}&nbsp;
            <button className={'edit-sv'} onClick={() => editSinhvien(s.id)}>Edit</button>&nbsp;
            <button className={'delete-sv'} onClick={() => deleteSinhvien(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form>
        <div><input name='ma' value={sv.ma} onChange={(e) => handleChange('ma', e.target.value)} placeholder='Nhập mã' /></div>
        <div><input name='hovaten' value={sv.hovaten} onChange={(e) => handleChange('hovaten', e.target.value)} placeholder='Nhập tên' /></div>
        <div><input name='email' value={sv.email} onChange={(e) => handleChange('email', e.target.value)} placeholder='Nhập email' /></div>
        <div><input name='username' value={sv.username} onChange={(e) => handleChange('username', e.target.value)} placeholder='Nhập username' /></div>
        <div><input name='password' value={sv.password} onChange={(e) => handleChange('password', e.target.value)} placeholder='Nhập password' /></div>
      </form>
      <button id={'add-sv'} onClick={addSinhVien}>
        Add
      </button>
      <div />
    </>
  );
}

export default App;
