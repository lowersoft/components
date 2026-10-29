/** @type {import('@storybook/web-components-vite').Preview} */
export default {
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    // Grouped by category; the base component leads its group, the rest follow alphabetically.
    options: {
      storySort: { method: 'alphabetical', order: ['Buttons', ['Base', '*'], 'Texts', 'Inputs', ['Input', ['Text Input', 'Textarea', 'Number Input', 'Checkbox', 'Radio Group', 'Switch', 'Range', 'Password Input', 'Address Input', 'Mention Input', 'Verification Code', 'Price Range', 'Shortcut Recorder', 'Natural Date Input', 'Swatch Fan', 'Period Picker', 'Date Range Brush', '*'], '*'], 'Navigation', ['Morphic Navbar', 'Toolbar', 'Smooth Tab', 'Profile Dropdown', 'Action Search Bar', 'Scroll Index', 'Status Island', 'Stack Panel', '*'], 'Cards', ['Card Flip', 'Card Stack', 'Bento Grid', 'Currency Transfer', 'Carousel Cards', 'Notification Stack', 'Liquid Gauge', 'Activity Terrain', 'Receipt Printer', 'Metric Card', 'Uptime Card', 'Spending Ring', 'Lightbox Grid', 'Image Generation Card', 'Audio Player Card', 'Onboarding Checklist', 'Deployment Card', 'Order Summary Card', 'Workspace Switcher', 'Continue Learning Card', 'Poll Card', 'Profile Card', 'Contact Card', 'Job Listing Card', 'Order Tracker', '*'], 'Media', ['Clip Trimmer', 'Synced Transcript', 'Focal Point Picker', 'Photo Straighten', '*'], 'Backgrounds', ['Dot Field', 'Background Paths', 'Shape Hero', 'Flow Field', 'Topo Background', '*'], 'Heroes', ['Globe Hero', 'Product Stage Hero', 'Work Flow Hero', 'Chart Hero', 'Terminal Hero', 'Kinetic Type Hero', '*'], 'Login', ['Magic Link Login', 'Account Chooser Login', 'Split Signup Login', 'Invite Signup', '*'], 'FAQs', ['Minimal FAQ', 'Help Center FAQ', 'Tabbed FAQ', 'Support Thread FAQ', '*'], 'Footers', ['Newsletter Footer', 'Sitemap Footer', 'Status Footer', '*'], 'Pricings', ['Layer Stack Pricing', 'Upgrade Summary', 'Three Tier Pricing', 'Ticket Pricing', 'Comparison Table Pricing', 'Credit Pack Pricing', 'Single Plan Pricing', 'Agency Services Pricing', '*'], 'Testimonials', ['Testimonial Grid', 'Testimonial Spotlight', 'Annotated Quote', '*'], 'Headline', ['Stats Headline', 'Install Headline', 'Inline Chips Headline', 'Filter Headline', '*'], 'Banners', ['Trial Status Banner', 'Announcement Banner', 'Sale Strip Banner', 'Incident Banner', 'Cookie Consent Banner', '*'], 'Forms', ['Support Composer', 'Booking Picker', 'Create Project Form', 'Feedback Composer', 'Edit Profile Form', 'Stepper Form', '*'], 'Modals', ['Upgrade Dialog', 'Settings Dialog', 'Two Factor Dialog', 'New Project Dialog', 'Shortcuts Dialog', 'Feedback Dialog', 'Newsletter Dialog', 'Session Timeout Dialog', '*'], 'Toolbars', ['Filter Toolbar', 'View Toggle Toolbar', 'Editor Toolbar', 'Format Toolbar', 'Canvas Toolbar', '*'], 'Animated List', ['Activity Feed', 'Swipe Actions List', 'Sortable List', 'Team Member List', '*'], 'Action Search Bar', ['Command Palette', 'Filter Search Bar', 'Docs Search', 'Slash Command Menu', '*'], 'Action Tool Bar', ['Action Toolbar', '*'], 'Kanban Board', ['*'], 'File Tree', ['*']] },
    },
  },
  globalTypes: {
    theme: {
      description: 'Color scheme',
      toolbar: {
        icon: 'mirror',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (story, { globals }) => {
      document.documentElement.dataset.theme = globals.theme;
      return story();
    },
  ],
};
