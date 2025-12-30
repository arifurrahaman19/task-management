const Footer = () => {
  return (
    <footer className="mt-8 py-4 border-t border-gray-300">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} LYPD. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
