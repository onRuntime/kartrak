import React from "react";
import styled, { keyframes } from "styled-components";

import { formatTime } from "../../../../../utils/__collection";

export type DomainItemProps = {
  domain: string;
  time: number;
  favIconUrl?: string;
};

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const SkeletonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const SkeletonBox = styled.div<{ width?: string }>`
  height: 13px;
  width: ${(props) => props.width || "30px"};
  background-color: #e2e8f0;
  border-radius: 3px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const SkeletonFavicon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background-color: #e2e8f0;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const DomainItemSkeleton: React.FC = () => {
  return (
    <SkeletonContainer>
      <SkeletonFavicon />
      <SkeletonBox width={"120px"} />
      <SkeletonBox width={"60px"} style={{ marginLeft: "auto" }} />
    </SkeletonContainer>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Favicon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background-color: var(--current-ecoindex-background-color, #f1faf1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FaviconPlaceholder = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 3px;
  background-color: var(--current-ecoindex-color, #009245);
  opacity: 0.5;
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #014335;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Time = styled.span`
  margin-left: auto;
  font-size: 13px;
  font-weight: 500;
  color: #014335;
  white-space: nowrap;
`;

const FaviconImage = styled.img`
  width: 15px;
  height: 15px;
  border-radius: 2px;
`;

const DomainItem: React.FC<DomainItemProps> = ({
  domain,
  time,
  favIconUrl,
}) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <Container>
      <Favicon>
        {favIconUrl && !imageError ? (
          <FaviconImage
            src={favIconUrl}
            alt={`Favicon for ${domain}`}
            onError={() => setImageError(true)}
          />
        ) : (
          <FaviconPlaceholder />
        )}
      </Favicon>

      <Name title={domain}>{domain}</Name>

      <Time>{formatTime(time)}</Time>
    </Container>
  );
};

export default React.memo(DomainItem);
