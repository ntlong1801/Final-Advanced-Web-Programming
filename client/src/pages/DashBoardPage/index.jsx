import Header from 'layout/header';
import Sidebar from 'layout/sidebar';
import './style.scss';
import { useEffect, useState } from 'react';
import instance from 'config';

export default function DashBoardPage() {
  const [attendedClasses, setAttendedClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');

  const user = JSON.parse(localStorage.getItem('user_profile'));

  useEffect(() => {
    instance.get(`/class/classesByUserId?id=${user.id}`).then((response) => {
      setAttendedClasses(response.data);
      setIsLoading(false);
    }).catch(() => {
    });
  }, []);

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleCreateClass = () => {
    instance.post('/class/addClass', {
      name: newClassName,
      description: newClassDescription,
    })
      .then((response1) => {
        instance.post('/class/addUserToClass', {
          id_class: response1.data.id,
          id_user: user.id,
          role: 'teacher',
        }).then(() => { }).catch(() => { });
        instance.get(`/class/classesByUserId?id=${user.id}`).then((response2) => {
          setAttendedClasses(response2.data);
        }).catch(() => {
        });
        handleCloseForm();
      })
      .catch(() => {
      });
  };

  return (
    <div className="background" style={{ display: 'flex', flexDirection: 'column' }}>
      <Header>
        <div>This is DashBoard Page</div>
      </Header>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="blur-overlay" />
          <div className="content">
            <h1>Your Classes</h1>
            <table className="striped-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Class Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {attendedClasses.map((classItem, index) => (
                  <tr className={index % 2 === 0 ? 'even' : 'odd'}>
                    <td>{index + 1}</td>
                    <td>{classItem.name}</td>
                    <td>{classItem.description}</td>
                  </tr>
                ))}
                {showForm && (
                  <tr>
                    <td>{attendedClasses.length + 1}</td>
                    <td>
                      <input
                        type="text"
                        aria-label="Save"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        aria-label="Save"
                        value={newClassDescription}
                        onChange={(e) => setNewClassDescription(e.target.value)}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {!showForm && (
              <button type="button" onClick={handleOpenForm}>Create New Class</button>
            )}
            {showForm && (
              <>
                <button type="button" onClick={handleCreateClass}>Create</button>
                <button type="button" onClick={handleCloseForm}>Cancel</button>
              </>
            )}
          </div>
        </>
      )}
      <img
        className="fullscreen-image"
        src=".\dashBoard2.png"
        alt="Dashboardimage"
      />
    </div>
  );
}
