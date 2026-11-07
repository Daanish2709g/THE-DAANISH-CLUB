import { OrderTrackingInfo } from '../types/suit';

export const TRACKING_STAGES = [
  {
    stage: 1,
    title: 'Cloth Commissioned & Laser Sheared',
    description: 'Bespoke bolts dispatched from Loro Piana/Scabal mills. Fiber density and tension laser-calibrated.',
    location: 'Quarona Atelier, Biella / Huddersfield Mill',
  },
  {
    stage: 2,
    title: 'Floating Horsehair Canvassing',
    description: 'Master cutter hand-pads Irish linen and Mongolian horsehair canvas to form the jacket chest piece.',
    location: 'Savile Row Cutting Suite, London',
  },
  {
    stage: 3,
    title: 'First Baste Fitting & Silhouette QA',
    description: 'Garment assembled with white basting thread. Silhouette checked against client biometric 3D scan.',
    location: 'Milanese Tailoring Chamber, Via Monte Napoleone',
  },
  {
    stage: 4,
    title: 'Milanese Buttonholes & Silk Monogramming',
    description: '1,200 hand-sewn stitches. Silk buttonholes hand-gimped with gold bullion thread.',
    location: 'Private Embroidery Studio, Paris',
  },
  {
    stage: 5,
    title: 'Steam Pressing & Cedar Trunk Sealing',
    description: 'Hand-pressed with dry steam over buck irons. Vacuum-sealed in aromatic Spanish cedar travel trunk.',
    location: 'Quality Assurance Vault, London Atelier',
  },
  {
    stage: 6,
    title: 'Global Diplomatic Air Express In Transit',
    description: 'Transferred to DHL Express Diplomatic Courier. Real-time temperature & tamper tracking active.',
    location: 'Air Cargo International Transit Hub',
  },
];

export function generateMockOrder(orderIdInput: string): OrderTrackingInfo {
  const cleanId = orderIdInput.trim().toUpperCase() || 'TDC-8921';
  // Deterministic stage based on ID
  const charCodeSum = cleanId.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const stage = (charCodeSum % 6) + 1; // 1 to 6

  const stageInfo = TRACKING_STAGES[stage - 1];

  const now = new Date();
  const estimatedDate = new Date(now.getTime() + (7 - stage) * 24 * 60 * 60 * 1000);

  const milestones = TRACKING_STAGES.map((s, idx) => {
    const isCompleted = s.stage <= stage;
    const stageDate = new Date(now.getTime() - (stage - s.stage) * 2 * 24 * 60 * 60 * 1000);
    return {
      stage: s.stage,
      title: s.title,
      description: s.description,
      location: s.location,
      timestamp: isCompleted ? stageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Estimated Stage',
      isCompleted,
    };
  });

  return {
    orderId: cleanId,
    customerName: 'Lord Alistair Sterling',
    items: [],
    currency: 'USD',
    totalPaid: 3275,
    statusStage: stage,
    statusLabel: stageInfo.title,
    estimatedDeliveryDate: estimatedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' }),
    courier: 'DHL Express Worldwide Diplomatic Pouch',
    trackingNumber: `DHL-EXP-AU-${cleanId.replace(/[^A-Z0-9]/g, '')}-X7`,
    destinationCity: 'New York / London / Tokyo',
    destinationCountry: 'International Vault Delivery',
    milestones,
  };
}
