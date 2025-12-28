import jobIconRaw from '../assets/icons/job-title-icon.svg?raw';
import companyIconRaw from '../assets/icons/company-icon.svg?raw';
import locationIconRaw from '../assets/icons/location-icon.svg?raw';
import { sanitizeToOutline } from '../lib/svg';

export const workIcons = {
  job: sanitizeToOutline(jobIconRaw, 15),
  company: sanitizeToOutline(companyIconRaw, 15),
  location: sanitizeToOutline(locationIconRaw, 15),
};

export const work = [
  {
    title: "Information Technology Support Specialist",
    company: "Gatestone",
    region: "Kitchener, ON",
    description:
      "Provide knowledgeable technical support and troubleshooting guidance for networking, Internet, cable, digital phone, and computer issues. Deliver exceptional customer experience while resolving complex workload issues across multi-node environments. Manage hardware and software installations, configurations, and updates while providing 24x7 customer support.",
    technologies: [
      "Networking",
      "TCP/IP",
      "LAN",
      "Computer Systems",
      "Customer Support",
      "Troubleshooting",
      "Technical Training",
    ],
  },
  {
    title: "Scrum Master (Part-time)",
    company: "BusyQA",
    region: "Remote",
    description:
      "Conducted end-to-end testing of various projects ensuring comprehensive quality assessment. Leveraged test automation frameworks and tools including Jira to develop automated test scripts. Analyzed functional, technical, and non-functional requirements ensuring accurate testing and alignment with project objectives using Zendesk ticketing system.",
    technologies: [
      "Jira",
      "Zendesk",
      "Test Automation",
      "Scrum",
      "Quality Assurance",
      "Agile",
    ],
  },
  {
    title: "Customer Service Representative",
    company: "Majorel",
    region: "Waterloo, ON",
    description:
      "Interacted with customers daily using active listening and critical thinking to resolve service inquiries. Processed credit card and e-check payments, handled customer complaints, and investigated billing and fraudulent activity concerns. Demonstrated ability to create positive customer relationships and effectively summarize conversation details.",
    technologies: [
      "Customer Service",
      "Active Listening",
      "Payment Processing",
      "Conflict Resolution",
      "CRM Systems",
    ],
  },
  {
    title: "Cloud Technical Solutions Developer",
    company: "Conestoga College",
    region: "Kitchener, ON",
    description:
      "Assisted in migrating application data from on-premises to cloud platforms (AWS, Azure). Managed Linux technical support for cloud-hosted applications, monitored application health using AWS CloudWatch. Supported version-controlled environments using GitHub and GitLab, and gained exposure to Infrastructure as Code with Terraform.",
    technologies: [
      "AWS",
      "Azure",
      "Linux",
      "CloudWatch",
      "SharePoint",
      "GitHub",
      "GitLab",
      "Terraform",
      "Docker",
    ],
  },
];

export type WorkItem = (typeof work)[number];

