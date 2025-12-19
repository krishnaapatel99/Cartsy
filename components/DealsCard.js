import Link from 'next/link';
import Image from 'next/image';

export default function DealsCards() {
    // 6 unique deals that will be repeated
    const uniqueDeals = [
        {
            image: '/deals/hat.jpg',
            alt: 'Special Deal 1',
            href: '/deals/1'
        },
        {
            image: '/deals/jean.jpg',
            alt: 'Special Deal 2',
            href: '/deals/2'
        },
        {
            image: '/deals/jewellery.jpg',
            alt: 'Special Deal 3',
            href: '/deals/3'
        },
        {
            image: '/deals/hoodie.jpg',
            alt: 'Special Deal 4',
            href: '/deals/4'
        },
        {
            image: '/deals/shirt1.jpg',
            alt: 'Special Deal 5',
            href: '/deals/5'
        },
        {
            image: '/deals/shirt2.jpg',
            alt: 'Special Deal 6',
            href: '/deals/6'
        },{
            image: '/deals/jacket.jpg',
            alt: 'Special Deal 6',
            href: '/deals/6'
        },
        {
            image: '/deals/tshirt.jpg',
            alt: 'Special Deal 6',
            href: '/deals/6'
        }
    ];
    
    
    const deals = [...uniqueDeals, ...uniqueDeals];

    return (
        <div className='w-full overflow-hidden'> 
            <div className="marquee-track whitespace-nowrap flex items-center mt-10 ml-10 mr-10">
                {deals.map((deal, index) => (
                    <Link 
                        href={deal.href}
                        key={index}
                        className='h-[42vh] w-[37vh] rounded-2xl ml-10 mb-20 overflow-hidden bg-white flex items-center justify-center'
                    >
                        <div className='relative w-full h-full'>
                            <Image
                                src={deal.image}
                                alt={deal.alt}
                                fill
                                className='object-cover'
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}