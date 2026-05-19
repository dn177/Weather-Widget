// Helper function to get translated project data
export const getTranslatedProject = (project, t) => {
  const projectKey = `projects.${project.id}`;
  
  return {
    ...project,
    title: t(`${projectKey}.title`),
    description: t(`${projectKey}.description`),
    highlights: project.highlights.map((_, index) => 
      t(`${projectKey}.highlights.${index}`)
    ),
    links: project.links.map((link, index) => ({
      ...link,
      label: t(`${projectKey}.links.${index}`)
    }))
  };
};