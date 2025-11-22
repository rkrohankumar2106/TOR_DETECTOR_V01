from scapy.all import rdpcap, IP
from sqlalchemy.orm import Session
from datetime import datetime
try:
    from . import models
    from .intel import geoip_service
except ImportError:
    import models
    from intel import geoip_service

def analyze_pcap(file_path: str, db: Session) -> int:
    """
    Analyzes a PCAP file, checks for Tor traffic, performs GeoIP lookup,
    and stores results in the database.
    Returns the total count of threats (Tor traffic).
    """
    threat_count = 0
    
    try:
        packets = rdpcap(file_path)
    except Exception as e:
        print(f"Error reading PCAP: {e}")
        return 0

    # Cache Tor nodes for faster lookup
    # Fetching all IPs into a set
    tor_ips = {node.ip_address for node in db.query(models.TorNode.ip_address).all()}

    new_logs = []
    
    for pkt in packets:
        if IP in pkt:
            src_ip = pkt[IP].src
            dst_ip = pkt[IP].dst
            timestamp = datetime.fromtimestamp(float(pkt.time))
            
            # Check if destination is a Tor node
            is_tor = dst_ip in tor_ips
            if is_tor:
                threat_count += 1
            
            # GeoIP lookup
            # We use the destination IP for location in this context, 
            # or maybe source? The prompt says "Run GeoIP lookup", usually for the remote IP.
            # If src is local, we want dst. If dst is local, we want src.
            # Assuming we want to know where the traffic is going/coming from.
            # Let's lookup both or just dst as per typical "threat" analysis if we assume outbound.
            # But the prompt says "ForensicLog" has "geo_city", "geo_country".
            # I'll lookup the DST IP for now as it's the one being checked against Tor.
            
            geo_data = geoip_service.get_location(dst_ip)
            
            log = models.ForensicLog(
                src_ip=src_ip,
                dst_ip=dst_ip,
                timestamp=timestamp,
                is_tor_traffic=is_tor,
                geo_city=geo_data.get("geo_city"),
                geo_country=geo_data.get("geo_country"),
                latitude=geo_data.get("latitude"),
                longitude=geo_data.get("longitude")
            )
            new_logs.append(log)

    # Bulk insert logs
    if new_logs:
        db.add_all(new_logs)
        db.commit()

    return threat_count
