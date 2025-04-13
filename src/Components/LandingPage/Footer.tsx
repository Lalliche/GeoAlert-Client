const Footer = () => {
  return (
    <footer className="bg-txt text-white py-4 text-center">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} GeoAlert. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
