import { useState } from "react";
import { Button } from "@/components/ui/button";
import jeffImage from "@assets/jeff_1754579357023.webp";
import ashinaImage from "@assets/ashina_1754579357036.webp";
import undeadImage from "@assets/undead_1754579357037.webp";
import grimReaperImage from "@assets/grim reaper_1754579357037.webp";
import cowboyImage from "@assets/cowboy_1754579357037.webp";
import bomoImage from "@assets/bomo_1754579357038.webp";
import icoImage from "@assets/ico_1754579357038.webp";
import mumrikImage from "@assets/mumrik_1754579357038.webp";
import snowImage from "@assets/snow_1754579357039.webp";

interface GerbilNft {
  id: string;
  name: string;
  image: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  attributes: string[];
  cardanoScanUrl?: string;
}

const GERBIL_NFTS: GerbilNft[] = [
  {
    id: "jeff",
    name: "Jeff - Laser Eyes",
    image: jeffImage,
    rarity: "Legendary",
    attributes: ["Laser Eyes", "Mischievous", "Power Level 9000"],
    cardanoScanUrl: "https://cardanoscan.io/token/jeff123"
  },
  {
    id: "ashina",
    name: "Ashina - Samurai Warrior",
    image: ashinaImage,
    rarity: "Epic",
    attributes: ["Samurai", "Golden Armor", "Honor Badge"],
    cardanoScanUrl: "https://cardanoscan.io/token/ashina456"
  },
  {
    id: "undead",
    name: "Undead - Zombie Gerbil",
    image: undeadImage,
    rarity: "Rare",
    attributes: ["Zombie", "Exposed Brain", "Creepy"],
    cardanoScanUrl: "https://cardanoscan.io/token/undead789"
  },
  {
    id: "grimreaper",
    name: "Grim Reaper",
    image: grimReaperImage,
    rarity: "Epic",
    attributes: ["Death", "Scythe", "Dark Powers"],
    cardanoScanUrl: "https://cardanoscan.io/token/grim101"
  },
  {
    id: "cowboy",
    name: "Cowboy - Wild West",
    image: cowboyImage,
    rarity: "Uncommon",
    attributes: ["Cowboy Hat", "Gunslinger", "Desert Wanderer"],
    cardanoScanUrl: "https://cardanoscan.io/token/cowboy202"
  },
  {
    id: "bomo",
    name: "Bomo - Gentleman",
    image: bomoImage,
    rarity: "Rare",
    attributes: ["Gentleman", "Top Hat", "Sophisticated"],
    cardanoScanUrl: "https://cardanoscan.io/token/bomo303"
  },
  {
    id: "ico",
    name: "Ico - Viking Warrior",
    image: icoImage,
    rarity: "Epic",
    attributes: ["Viking", "Horned Helmet", "Battle Ready"],
    cardanoScanUrl: "https://cardanoscan.io/token/ico404"
  },
  {
    id: "mumrik",
    name: "Mumrik - Forest Ranger",
    image: mumrikImage,
    rarity: "Common",
    attributes: ["Forest", "Nature Lover", "Green Cloak"],
    cardanoScanUrl: "https://cardanoscan.io/token/mumrik505"
  },
  {
    id: "snow",
    name: "Snow - Winter Survivor",
    image: snowImage,
    rarity: "Rare",
    attributes: ["Winter", "Cold Resistant", "Furry Companion"],
    cardanoScanUrl: "https://cardanoscan.io/token/snow606"
  }
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'Common': return 'text-gray-400 border-gray-400';
    case 'Uncommon': return 'text-green-400 border-green-400';
    case 'Rare': return 'text-blue-400 border-blue-400';
    case 'Epic': return 'text-purple-400 border-purple-400';
    case 'Legendary': return 'text-orange-400 border-orange-400';
    default: return 'text-gray-400 border-gray-400';
  }
};

interface GerbilNftGalleryProps {
  walletAddress: string | null;
  onNftSelect?: (nft: GerbilNft) => void;
}

export default function GerbilNftGallery({ walletAddress, onNftSelect }: GerbilNftGalleryProps) {
  const [selectedNft, setSelectedNft] = useState<GerbilNft | null>(null);

  const handleNftClick = (nft: GerbilNft) => {
    setSelectedNft(nft);
    onNftSelect?.(nft);
  };

  const handleCardanoScan = (nft: GerbilNft) => {
    if (nft.cardanoScanUrl) {
      window.open(nft.cardanoScanUrl, '_blank');
    }
  };

  if (!walletAddress) {
    return (
      <div className="text-center p-6">
        <div className="text-6xl mb-4">🔒</div>
        <p className="text-gray-400 font-mono">Connect Lace Wallet to view your Gerbil NFTs</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-orbitron font-bold text-orange-400 mb-2">
          🐹 GERBIL NFT COLLECTION
        </h2>
        <p className="text-sm text-gray-400 font-mono">
          {GERBIL_NFTS.length} Unique Gerbils • Cardano Blockchain
        </p>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {GERBIL_NFTS.map((nft) => (
          <div 
            key={nft.id}
            className={`group relative bg-black/60 rounded-lg border-2 p-3 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              selectedNft?.id === nft.id 
                ? `${getRarityColor(nft.rarity)} shadow-lg` 
                : 'border-gray-600 hover:border-orange-400/50'
            }`}
            onClick={() => handleNftClick(nft)}
          >
            {/* NFT Image */}
            <div className="relative aspect-square mb-3 rounded overflow-hidden">
              <img 
                src={nft.image} 
                alt={nft.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-mono rounded border ${getRarityColor(nft.rarity)} bg-black/80`}>
                  {nft.rarity}
                </span>
              </div>
            </div>
            
            {/* NFT Info */}
            <h3 className="text-sm font-orbitron font-bold text-orange-300 mb-2">
              {nft.name}
            </h3>
            
            {/* Attributes */}
            <div className="flex flex-wrap gap-1 mb-2">
              {nft.attributes.slice(0, 2).map((attr, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-800/60 text-gray-300 rounded"
                >
                  {attr}
                </span>
              ))}
            </div>

            {/* Cardano Scan Button */}
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
              onClick={(e) => {
                e.stopPropagation();
                handleCardanoScan(nft);
              }}
            >
              📊 VIEW ON CARDANOSCAN
            </Button>
          </div>
        ))}
      </div>

      {/* Selected NFT Details */}
      {selectedNft && (
        <div className="bg-black/80 rounded-lg border-2 border-orange-500/50 p-6">
          <h3 className="text-xl font-orbitron font-bold text-orange-400 mb-4">
            Selected: {selectedNft.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img 
                src={selectedNft.image} 
                alt={selectedNft.name}
                className="w-full rounded-lg"
              />
            </div>
            
            <div>
              <div className="space-y-4">
                <div>
                  <span className="text-gray-400 font-mono text-sm">Rarity:</span>
                  <span className={`ml-2 px-3 py-1 rounded border font-mono ${getRarityColor(selectedNft.rarity)}`}>
                    {selectedNft.rarity}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-400 font-mono text-sm block mb-2">Attributes:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedNft.attributes.map((attr, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-800/60 text-gray-300 rounded font-mono text-sm"
                      >
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full bg-orange-500/20 border border-orange-500 text-orange-400 hover:bg-orange-500/30"
                  onClick={() => handleCardanoScan(selectedNft)}
                >
                  🔗 VIEW TRANSACTION ON CARDANO
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}