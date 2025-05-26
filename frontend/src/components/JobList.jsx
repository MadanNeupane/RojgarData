const JobList = ({jobs}) => {
  return (
    <div className="job-list">
      {jobs.map((job) => (
        <div key={job.id} className="job-item">
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <span>{job.location}</span>
          <span>{job.salary}</span>
        </div>
      ))}
    </div>
  )
}
export default JobList