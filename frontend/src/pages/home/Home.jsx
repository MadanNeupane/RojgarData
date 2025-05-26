import Navbar from '../../components/Navbar';
import JobList from '../../components/JobList';
// import './Home.css';
import { useEffect, useState } from 'react';
import api from '../../api';
import Loading from '../../components/Loading';


const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs/');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="home-container">
      <Navbar />
      <JobList jobs={jobs} />
    </div>
  );
}
export default Home;