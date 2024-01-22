import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaginationList.css';

const PaginatedList = () => {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage, setContactsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totaldata, SetTotalData] = useState(5);

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/contacts', {
          params: {
            page: currentPage,
            contactsPerPage,
          },
        });

        setContacts(response.data.contacts);
        setTotalPages(Math.ceil(response.data.totalContacts / contactsPerPage));
        SetTotalData(response.data.totalContacts)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage, contactsPerPage]);

  // Calculate the index of the first and last contact to display on the current page

  var indexOfLastContact = currentPage * contactsPerPage;
  var indexOfFirstContact = indexOfLastContact - contactsPerPage;
  if(indexOfLastContact>totaldata){
    indexOfLastContact=totaldata;
  }

  // Change page
// Change page
const changePage = (pageNumber) => {
    const lastPageIndex = Math.ceil(totalPages);
    if (pageNumber > 0 && pageNumber <= lastPageIndex) {
      setCurrentPage(pageNumber); 
    }
  };
  
  // Change contacts per page
  const changeContactsPerPage = (newContactsPerPage) => {
    setContactsPerPage(newContactsPerPage);
    setCurrentPage(1); // Reset to the first page when changing contacts per page
  };

  return (
    <>
    <div className='data'>
      <h1>Paginated List</h1>
      <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr key={index}>
                  <td>{contact.name}</td>
                  <td>{contact.phoneNumber}</td>
                  <td>{contact.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
      <div className="pages">
        <div className='indexofpages'>
          {/* Pagination buttons */}
          <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
            &lt;
          </button>
          <span> {indexOfFirstContact + 1}-{indexOfLastContact} of {totaldata}</span>
          <button onClick={() => changePage(currentPage + 1)} >
            &gt;
          </button>
        </div>
        <div className='contactsperpage'>
          {/* Dropdown to change contacts per page */}
          <select value={contactsPerPage} onChange={(e) => changeContactsPerPage(parseInt(e.target.value, 10))}>
            {[5, 10, 15, 20].map((option) => (
              <option key={option} value={option}>
                {option} per page
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default PaginatedList;
