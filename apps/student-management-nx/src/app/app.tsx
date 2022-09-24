// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import styles from './app.module.scss';
import NxWelcome from './nx-welcome';
import axios from 'axios';

interface SinhVien {
  id?: number;
  ma?: string;
  hovaten?: string;
  email?: string;
  phone?: string;
  username?: string;
  password?: string;
  image_url?: string;
}

export function App() {
  const [sinhViens, setSinhViens] = useState<SinhVien[]>([]);
  const [sv, setSv] = useState<SinhVien>({});
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/sinhvien')
      .then((_) => _.json())
      .then(setSinhViens);
  }, []);

  const handleChange = (key: string, value: string | undefined) => {
    console.log(key, value);
    setSv({ ...sv, [key]: value });
  }

  function saveSinhVien() {
    console.log(sv);
    const isUpdate = (sv.id) ? true : false;
    if (isUpdate) {
      fetch('http://localhost:3000/api/sinhvien/' + sv.id, {
        method: 'PUT',
        body: JSON.stringify(sv),
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then((_) => _.json())
        .then((newSv) => {
          console.log(newSv);
          fetch('http://localhost:3000/api/sinhvien')
            .then((_) => _.json())
            .then(setSinhViens);
        });
    } else {
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
          fetch('http://localhost:3000/api/sinhvien')
            .then((_) => _.json())
            .then(setSinhViens);
        });
    }
  }

  function deleteSinhvien(id: number | undefined) {
    fetch(`http://localhost:3000/api/sinhvien/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        console.log(res);

        fetch('http://localhost:3000/api/sinhvien')
          .then((_) => _.json())
          .then(setSinhViens);
      });
  }

  function editSinhvien(sinhvien: SinhVien) {
    setSv({ ...sv, ...sinhvien });
  }

  function handleUploadAvatar(selectedFile: File): void {
    const formData = new FormData();
    formData.append('avatar', selectedFile);
    axios
      .post('http://localhost:3000/photo/upload', formData)
      .then((res) => {
        console.log(res);
        setSv({ ...sv, image_url: res.data.destination + res.data.filename });
      })
      .catch((err) => console.log(err));
  }

  function handleSearch(): void {
    console.log('Hello', query);
    axios
      .get('http://localhost:3000/api/sinhvien', {params: {query: query}})
      .then((res) => {
        setSinhViens(res.data);
      })
  }

  return (
    <>
      <div className="container">
        <div className="card my-2">
          <div className="card-body">
            <form action='#' method='post' encType='multipart/form-data'>
              <div className='mb-1'>
                <label htmlFor="" className='form-label'>Mã</label>
                <input className='form-control' name='ma' value={sv.ma} onChange={(e) => handleChange('ma', e.target.value)} placeholder='Nhập mã' />
              </div>
              <div className='mb-1'>
                <label htmlFor="" className='form-label'>Họ & tên</label>
                <input className='form-control' name='hovaten' value={sv.hovaten} onChange={(e) => handleChange('hovaten', e.target.value)} placeholder='Nhập tên' />
              </div>

              <div className='mb-1'>
                <label htmlFor="" className='form-label'>Email</label>
                <input className='form-control' name='email' value={sv.email} onChange={(e) => handleChange('email', e.target.value)} placeholder='Nhập email' />
              </div>

              <div className='mb-1'>
                <label htmlFor="" className='form-label'>Số điện thoại</label>
                <input className='form-control' name='phone' value={sv.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder='Nhập số điện thoại' />
              </div>

              <div className='mb-1'>
                <label htmlFor="" className='form-label'>Username</label>
                <input className='form-control' name='username' value={sv.username} onChange={(e) => handleChange('username', e.target.value)} placeholder='Nhập username' />
              </div>

              <div className='mb-1'>
                <label htmlFor="" className='form-label'>Password</label>
                <input className='form-control' name='password' value={sv.password} onChange={(e) => handleChange('password', e.target.value)} placeholder='Nhập password' />
              </div>

              <div className='mb-1'>
                <label htmlFor="" className='form-label'>Avatar</label>
                <input className="form-control"
                  name='avatar'
                  type='file'
                  onChange={(e) => handleUploadAvatar(e.target.files![0])}
                />
                <div>
                  {sv.image_url
                    ? <img className='img-thumbnail' width={'150px'} alt='avatar' src={'http://localhost:3000/' + sv.image_url} />
                    : ''
                  }
                </div>
              </div>
            </form>
            <button className='btn btn-primary' onClick={saveSinhVien}>
              Lưu
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
              <div className="mb-1">
                <label htmlFor="" className='form-label'>Nhập tên hoặc số điện thoại</label>
                <input className='form-control' type="text" name="query" id="query" onChange={(e) => setQuery(e.target.value)} />
                <button className='btn btn-default' onClick={() => handleSearch()}>Tìm kiếm</button>
              </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">Danh sách Sinh viên</div>
          <div className="card-body">
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th className='text-center'>ID</th>
                  <th className='text-center'>Mã</th>
                  <th className='text-center'>Username</th>
                  <th className='text-center'>Avatar</th>
                  <th className='text-center'>Họ và tên</th>
                  <th className='text-center'>Email</th>
                  <th className='text-center'>Số điện thoại</th>
                  <th className='text-center'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sinhViens.map((s) => (
                  <tr className={'sv'} key={s.id}>
                    <td className='text-center'>{s.id}</td>
                    <td className='text-center'>{s.ma}</td>
                    <td>{s.username}</td>
                    <td className='text-center'>
                      {s.image_url
                        ? <img className='img-thumbnail' width={'80px'} alt='avatar' src={'http://localhost:3000/' + s.image_url} />
                        : ''
                      }
                    </td>
                    <td>{s.hovaten}</td>
                    <td>{s.email}</td>
                    <td>{s.phone}</td>
                    <td className='text-center'>
                      <button title='Sửa' className='btn btn-info' onClick={() => editSinhvien(s)}>Sửa</button>&nbsp;
                      <button title='Xóa' className='btn btn-danger' onClick={() => { if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) deleteSinhvien(s.id) }}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div />
    </>
  );
}

export default App;

