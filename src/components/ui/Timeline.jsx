const Timeline = ({ items }) => {
  const defaultMilestones = [
    {
      id: 1,
      date: "Nov 2022 - Present",
      title: "Senior UX/UI Designer, ICRC",
      description: "Currently leading UX strategy and design initiatives that make complex humanitarian systems more intuitive, inclusive, and data-informed.",
      type: "professional",
      importance: "critical"
    },
    {
      id: 2,
      date: "Jun 2021 - Nov 2022",
      title: "Lead UX/UI Designer, Open Institute",
      description: "Was the first UX/UI designer in the organization and helped them transition from IT-driven to user-centred cultures.",
      type: "professional",
      importance: "important"
    },
    {
      id: 3,
      date: "Apr 2016 - Jun 2021",
      title: "UX/UI Designer + Frontend Designer, Brainwave Communications",
      description: "Took a keen interest in design thinking. Considered a career shift after realizing the impact of good design on user experience.",
      type: "professional",
      importance: "critical"
    },
    {
      id: 4,
      date: "Aug 2015 - Aug 2016",
      title: "WordPress Developer (Consultant), Masterbrands Ltd.",
      description: "Developed and maintained WordPress websites for various clients, ensuring responsive design and optimal user experience.",
      type: "professional",
      importance: "important"
    },
    {
      id: 5,
      title: "Web Design Assistant + Graphic Designer, Harler Technologies",
      date: "Jan 2015 - Jul 2015",
      description: "Served as a jack-of-all trades, mastering different skills.",
      type: "professional",
      importance: "standard"
    }
  ];

  // Use items prop if provided, otherwise use default milestones
  const milestones = items && items.length > 0 ? items : defaultMilestones;

  const getImportanceStyles = (importance) => {
    switch (importance) {
      case "critical":
        return "bg-red-100 border-red text-red-800";
      case "important":
        return "bg-blue-100 border-blue text-blue-800";
      default:
        return "bg-gray-100 border-gray text-gray-800";
    }
  };

  const getIconStyles = (importance) => {
    switch (importance) {
      case "critical":
        return "bg-red-500 text-white";
      case "important":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="timeline-container">
        <div className="timeline-divider"></div>
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className={`timeline-row ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
          >
            <div className="order-1 w-5/12"></div>
            {/* Updated: Replaced icon with number */}
            <div className="timeline-icon order-1">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${getIconStyles(milestone.importance || "standard")}`}
              >
                {index + 1}
              </div>
            </div>
            <div
              className={`timeline-item order-1 ${getImportanceStyles(
                milestone.importance || "standard"
              )}`}
            >
                <span className="card-date">{milestone.date}</span>
              <h3>{milestone.title}</h3>
              <p className="mb-0">{milestone.description}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Timeline;