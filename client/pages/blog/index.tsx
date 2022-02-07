import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";
import styles from '../../styles/blog.module.css'

const Blog: FunctionComponent = () => {
    const { t } = useTranslation('blog')

    return (
        <div className={styles.blog}>
            <h1>{t('LATEST_NEWS')}</h1>
            <div className={styles.grid}>
                {t('POSTS_COMMING_SOON')}
                {/* {
                    [...Array(9)].map((x, index) =>
                        <Link href={`/blog/${index}`} key={index}>
                            <a>
                                <article>
                                    <Image src="/images/logo_big.png" width="515" height="290" alt="Juicify" />
                                    <h3>Secretlab The Witcher Edition chair</h3>
                                </article>
                            </a>
                        </Link>
                    )
                } */}
            </div>
        </div >
    );
}

export default Blog;
