// Helper function to get translated project data
// Passes the literal field value as defaultValue, so projects with i18n keys
// resolve via translations while projects with literal strings keep their string.
export const getTranslatedProject = (project, t) => {
  const projectKey = `projects.${project.id}`;

  return {
    ...project,
    title: t(`${projectKey}.title`, { defaultValue: project.title }),
    description: t(`${projectKey}.description`, { defaultValue: project.description }),
    highlights: project.highlights.map((highlight, index) =>
      t(`${projectKey}.highlights.${index}`, { defaultValue: highlight })
    ),
    links: project.links.map((link, index) => ({
      ...link,
      label: t(`${projectKey}.links.${index}`, { defaultValue: link.label }),
    })),
  };
};
