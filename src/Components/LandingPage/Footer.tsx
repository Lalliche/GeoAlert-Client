const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-4 text-center">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} GeoAlert. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
