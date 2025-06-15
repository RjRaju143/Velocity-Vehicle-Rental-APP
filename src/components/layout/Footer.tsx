const Footer = () => {
  return (
    <footer className="bg-card border-t mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Velocity Vehicle Rentals. All rights reserved.</p>
        <p className="text-xs mt-1">Designed by an expert designer for a professional feel.</p>
      </div>
    </footer>
  );
};

export default Footer;
