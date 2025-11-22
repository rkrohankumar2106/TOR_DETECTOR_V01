import geoip2.database
import os
import requests
from sqlalchemy.orm import Session
try:
    from . import models
except ImportError:
    import models

# Path to the MaxMind GeoLite2 database
# In a real scenario, this should be configured via env vars or config file
GEOIP_DB_PATH = "GeoLite2-City.mmdb"

class GeoIPService:
    def __init__(self, db_path=GEOIP_DB_PATH):
        self.db_path = db_path
        self.reader = None
        if os.path.exists(self.db_path):
            try:
                self.reader = geoip2.database.Reader(self.db_path)
            except Exception as e:
                print(f"Error loading GeoIP database: {e}")
        else:
            print(f"GeoIP database not found at {self.db_path}")

    def get_country(self, ip_address):
        if not self.reader:
            return "Unknown"
        try:
            response = self.reader.city(ip_address)
            return response.country.name
        except Exception:
            return "Unknown"

    def get_location(self, ip_address):
        """
        Returns a dictionary with geo_city, geo_country, latitude, longitude.
        """
        if not self.reader:
            return {}
        try:
            response = self.reader.city(ip_address)
            return {
                "geo_city": response.city.name,
                "geo_country": response.country.name,
                "latitude": response.location.latitude,
                "longitude": response.location.longitude
            }
        except Exception:
            return {}

    def close(self):
        if self.reader:
            self.reader.close()

# Global instance
geoip_service = GeoIPService()

def refresh_tor_nodes(db: Session) -> int:
    """
    Fetches Tor exit nodes from the official source,
    clears the local TorNode table, and bulk inserts the new IPs.
    """
    url = "https://check.torproject.org/torbulkexitlist"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        ip_list = response.text.strip().splitlines()
        
        # Clear existing nodes
        db.query(models.TorNode).delete()
        
        # Bulk insert
        # Using a generator or list comprehension to create model instances
        # For very large lists, consider using db.bulk_insert_mappings if performance is an issue,
        # but for ~2000 nodes, adding objects is fine.
        new_nodes = [models.TorNode(ip_address=ip) for ip in ip_list if ip]
        
        db.add_all(new_nodes)
        db.commit()
        
        return len(new_nodes)
        
    except Exception as e:
        db.rollback()
        print(f"Error refreshing Tor nodes: {e}")
        return 0
