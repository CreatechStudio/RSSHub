import cache from '@/utils/cache';
import got from '@/utils/got';
import { parseDate } from '@/utils/parse-date';
import { ProcessFeed } from './utils';

export default async (ctx) => {
    const limit = ctx.req.query('limit') ?? 10;
    const rootUrl = 'https://www.iyingdi.com';
    const url = `${rootUrl}/feed/list/user/v3?feedIdUp=0&feedIdDown=0&hotfeed=1&system=web`;
    const { data } = await got(url);

    const articleList = data.feeds
        .slice(0, limit)
        .map((element) => ({
            title: element.feed.title,
            pubDate: parseDate(element.feed.created * 1000),
            link: `${rootUrl}/tz/post/${element.feed.sourceID}`,
            guid: element.feed.title,
            postId: element.feed.sourceID,
        }))
        .filter((item) => item.title !== undefined);

    const items = await ProcessFeed(cache, articleList);

    ctx.set('data', {
        title: '旅法师营地 - 首页资讯（旧版）',
        link: rootUrl,
        item: items,
    });
};
